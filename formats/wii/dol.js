const format = "DOL";

const fs = require("fs");
const { resolve, dirname } = require("path");
const replace = require("buffer-replace");

const config = require("../../config");
const utils = require("../../lib/utils");

module.exports = async ({ format, game, gameId, region, version, inputFile, isFromFormat, backup = true }) => {

  let mainDol = fs.readFileSync(inputFile);

  // Check if the dol contains any old server URLs we used before.
  let oldDomains = config.WII.OLD_DOMAINS;
  oldDomains.forEach(d => {
    if (mainDol.includes(Buffer.from(d))) {
      logger.error(`Your DOL file is not an original file because it contains our old servers and must be updated. Please update it by patching the original DOL file.`);
      throw new Error('DOL file contains old server URLs');
    };
  });

  logger.success('DOL file loaded successfully.');

  let jdVersion = version || game.version; // Game year, ex: 2014

  // 2014 games and 2014 mods have the same DOL but different game ID
  // and we can't detect ID from DOL (for 2014 only) so we check for boot.bin file
  if (jdVersion == 2014) {

    // If gameId is not provided, find it from boot.bin file
    if (!gameId) {
      const sysPath = inputFile.substring(0, inputFile.lastIndexOf('/'));
      const bootPath = `${sysPath}/boot.bin`;
      // Check if boot.bin exists
      if (!fs.existsSync(sysPath) || !fs.existsSync(bootPath)) {
        logger.error(
          "Are you sure you selected a DOL file that's located in DATA/sys? Can't find boot.bin file..."
        );
        throw new Error('boot.bin file not found');
      }

      // Read boot.bin data and determine the game ID
      const bootData = fs.readFileSync(bootPath);
      gameId = bootData.slice(0, 6).toString();
    };

    // Check if the JD5 game is available to patch
    if (!config.WII.JD5_IDS.includes(gameId)) {
      logger.error(`Your 'main.dol' ID ${gameId} is not available to patch.`);
      throw new Error(`Game ID ${gameId} not supported`);
    };

    // Depending on some JD5 games, we need to change tracking information 
    // to tell the difference while data is sent to tracking.
    switch (gameId) {
      case "SJME89":
        logger.info("JDJAPAN (SJME89) was detected.");
        STRINGS_JD5['wiitracking'] = 'jdjapan-trk';
        STRINGS_JD5['2399fff0497ae598539ccb3a61387f67833055ad'] = 'a09302313bd087b88a54fe1a010eb62ea3edbfad';
        STRINGS_JD5['JejDUqq7'] = 'DFe3qab8';
    };
  };

  // Before patching starts, make sure to backup the original DOL file
  if (backup) {
    const backupDolPath = resolve(dirname(inputFile), `backup-dol-${jdVersion}.dol`);
    fs.copyFileSync(inputFile, backupDolPath);
  };

  // Determine strings to be used with STRINGS_VERSION, if not exist, use default strings STRINGS_LEGACY
  let STRINGS_USED = utils.getStrings(game, version);
  if (!STRINGS_USED) {
    logger.error(`No strings (to replace) were found for ${version}, please provide a valid game.`);
    throw new Error('No replacement strings found');
  };

  logger.debug("Following strings will be replaced: " + JSON.stringify(STRINGS_USED));

  if (game.isLyN) {
    logger.info("Detected a LyN game, patching NAS and Shop only...");
    STRINGS_USED = config.WII.STRINGS_LYN;
  };

  logger.info('Patching DOL file! Please wait...');

  let replacedCount = 0;
  let totalStrings = 0;
  const missingStrings = [];

  for (const [key, value] of Object.entries(STRINGS_USED)) {
    const original = value.original;
    const replacement = value.replacement;
    const ignore = value?.ignore || [];
    const required = value?.required !== false; // Default to true

    // Skip ignored strings
    if (ignore.includes(jdVersion)) continue;

    // Only count required strings
    if (required) totalStrings++;
    else logger.debug(`Skipping optional string: ${original}`);

    const keyLen = original.length;
    const valueLen = replacement.length;
    const keyBuffer = Buffer.from(original);
    let valueBuffer = Buffer.from(replacement);

    if (keyLen > valueLen) {
      const diff = keyLen - valueLen;
      const nullsBuf = Buffer.alloc(diff, 0x00);
      valueBuffer = Buffer.concat([valueBuffer, nullsBuf]);
    }

    // Replace if it exists
    if (mainDol.includes(keyBuffer)) {
      mainDol = replace(mainDol, keyBuffer, valueBuffer);
      replacedCount++;
      logger.debug(`Replaced ${original} with ${replacement}`);
    } else if (required) {
      missingStrings.push(original);
      logger.debug(`${original} not found in DOL`);
    }
  };

  // Check replacement results
  if (replacedCount === 0) {
    logger.error(`None of the strings were replaced. Your DOL file was not patched. Are you sure it's the original file?`);
    throw new Error('No strings were replaced');
  }

  if (replacedCount < totalStrings) {
    logger.warn(`Warning: Only ${replacedCount} out of ${totalStrings} expected strings were replaced.`);
    logger.warn(`Missing strings: ${missingStrings.join(', ')}`);
    logger.warn(`This may indicate a corrupted, already-modified, or incorrect DOL file. Please provide an original DOL file to ensure proper patching.`);
    throw new Error('Not all required strings were replaced');
  }

  logger.success(`DOL was patched successfully. ${replacedCount} strings replaced.`);

  // Patching was completed, save the file
  const outputDolPath = resolve(dirname(inputFile), `main.dol`);
  fs.writeFileSync(outputDolPath, mainDol);

  if (!isFromFormat) {
    logger.success(`Patched DOL file saved to: ${outputDolPath}`);
    logger.success(`You can now pack the game with the patched DOL or run it directly from "main.dol" file on Dolphin.`);
  };
};