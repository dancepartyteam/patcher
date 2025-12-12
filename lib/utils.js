const fs = require("fs");
const path = require("path");
const utils = require('util');
const os = require("node:os");

const config = require("../config");

const Games = require("./games");
const dolGameFinder = require("./dol-game-finder");

class Utils {
  constructor() { };

  getStrings(game, version) {
    // Check if there's a specific strings config for this version
    const specificStrings = config.WII[`STRINGS_${version}`];

    if (specificStrings) {
      return specificStrings;
    };

    // If game uses STRINGS_LEGACY and has a room, replace LEGACY room path with game's room path
    if (game.wii && game.wii.strings === config.WII.STRINGS_LEGACY && game.wii.room) {
      return [
        ...config.WII.STRINGS_LEGACY,
        {
          original: `/${config.WII.ROOMS.LEGACY}/`,
          replacement: `/${game.wii.room}/`
        }
      ];
    };

    // If game has strings defined, return them as-is
    if (game.wii && game.wii.strings) {
      return game.wii.strings;
    };

    return null;
  };

  async detectFormat(inputPath) {

    const games = new Games();
    const ext = path.extname(inputPath);

    // ISO file
    if (ext == ".iso") {

      return new Promise((resolve, reject) => {
        // Read the first 6 bytes of the file
        const stream = fs.createReadStream(inputPath, { start: 0, end: 5 });
        let data = "";

        // Read the stream
        stream.on("data", (chunk) => {
          data += chunk;
        });

        // Process the data
        stream.on("end", () => {
          // The game ID is located at byte offset 0x20 (32) and is 6 bytes long
          const gameId = data.toString();
          // Check if the game ID is valid
          const isGameAvailable = games.isAvailable(gameId);
          // If not valid, return null
          if (!isGameAvailable) {
            logger.error(
              `${gameId} is not an available game to patch, please patch an available game.`
            );
            process.exit();
          }
          resolve({ gameId, format: "ISO" });
        });

        // Handle stream errors
        stream.on("error", (error) => {
          reject(error);
        });
      });

    }

    // WBFS file
    else if (ext == ".wbfs") {

      return new Promise((resolve, reject) => {
        // Read the first 518 bytes of the file
        const stream = fs.createReadStream(inputPath, { start: 0, end: 517 });
        let data = "";

        // Read the stream
        stream.on("data", (chunk) => {
          data += chunk;
        });

        // Process the data
        stream.on("end", () => {

          // The WBFS header is 512 bytes, followed by the game ID at the end
          const header = data.slice(0, 4);
          if (header !== "WBFS") { logger.error(`Invalid WBFS file`); process.exit(1); }

          // The game ID is located at byte offset 0x200 (512) and is 6 bytes long
          const gameId = data.slice(data.length - 6, data.length);

          // Check if the game ID is valid
          const isGameAvailable = games.isAvailable(gameId);
          // If not valid, return null
          if (!isGameAvailable) {
            logger.error(
              `${gameId} is not an available game to patch, please patch an available game.`
            );
            process.exit();
          }
          resolve({ gameId, format: "WBFS" });

        });

        // Handle stream errors
        stream.on("error", (error) => {
          reject(error);
        });
      });

    }

    // DOL file
    else if (ext == ".dol") {

      return new Promise((resolve, reject) => {
        // Read the first 3 bytes of the file
        const stream = fs.createReadStream(inputPath, { start: 0, end: 3 });
        let chunks = [];

        stream.on("data", (chunk) => {
          chunks.push(chunk);
        });

        stream.on("end", () => {
          // First 8 bytes as Buffer
          const data = Buffer.concat(chunks); // First 8 bytes as Buffer
          const dolSignature = Buffer.from([0x00, 0x00, 0x01, 0x00]);

          // Check if the file is a valid DOL file
          if (data.equals(dolSignature)) {
            // Get jdVersion via dol-game-finder
            const jdVersion = dolGameFinder(inputPath);

            // Check if the game is available to patch
            if (!games.isAvailable(jdVersion)) {
              logger.error(`${jdVersion} is not an available game to patch.`);
              process.exit(1);
            }
            resolve({ version: jdVersion, format: "DOL" });
          } else {
            logger.error(`Input is not a valid DOL file.`);
            process.exit(1);
          }
        });

        stream.on("error", reject);
      });
    }

    // BIN files (PS3's EBOOT.BIN)
    else if (ext == ".bin") {
      logger.warn(`BIN files are not currently supported, please provide an ISO, WBFS or a DOL file.`);
      process.exit();
    }

    // Nkit file (not supported)
    else if (ext == ".gcz" || ext == ".nkit" || ext == ".nkit.gcz") {
      logger.warn(`NKit files are not currently supported, please convert it to an ISO or a WBFS.`);
      process.exit();
    }

    // Cant detect
    else {
      return null;
    };
  };

  // Clear tmp folder
  clearTmp(gameId, format) {
    let p = path.resolve(global.root, "tmp");
    if (gameId) p = path.resolve(p, gameId);
    if (format) p = path.resolve(p, format);
    fs.rmSync(p, { recursive: true, force: true });
  };

  // Get patched file path
  getPatchedFilePath(inputPath, format, game, gameId) {
    const originalDir = path.dirname(inputPath);
    const name = `DanceParty Legacy (${game.version}) ${gameId} (${game.ids[gameId].r}).${format.toLowerCase()}`;
    return path.resolve(originalDir, name);
  };

  // Create tmp folder
  tmpFolder() {
    return fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  };

  // Remove tmp folder
  removeTmpFolder(tmpFolder) {
    return fs.rmSync(tmpFolder, { recursive: true });
  };
};

module.exports = new Utils();