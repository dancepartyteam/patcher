const { resolve } = require("path");
const { existsSync, statSync, mkdirSync } = require("fs");
const semver = require("semver");

const project = require("./package.json");
const cli = require("./lib/cli");
const utils = require("./lib/utils");
const logger = require("./lib/logger");

const Games = require("./lib/games");
const { PLATFORMS } = require("./config");

const exit = (code = 0) => {
  console.log("\nExiting in 10 seconds...");
  setTimeout(() => {
    process.exit(code);
  }, 10000);
};

// Make sure our %APPDATA% folder exists each launch.
const appDataPath = resolve(
  process.env.APPDATA ||
  (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"), project.name);

if (!existsSync(appDataPath)) {
  mkdirSync(appDataPath, { recursive: true });
};

// Entry function
(async () => {

  // Check for updates
  const currentVersion = project.version;
  const latestVersion = await utils.getLatestVersion();
  if (latestVersion && semver.gt(latestVersion, currentVersion)) {
    console.log(`\nA new version of ${project.name} is available! (v${latestVersion})`);
    console.log(`You are currently running v${currentVersion}.`);
    console.log(`To update, please download the new version from ${project.homepage}/releases/latest`);
    process.exit(0);
  };

  // Call CLI
  const cliArgs = await cli();
  logger.debug(cliArgs);
  
  const platform = cliArgs.platform;
  const game = cliArgs.selectedGame;
  const gameId = cliArgs.gameId;
  const region = cliArgs.region;
  const inputPath = cliArgs.inputFile;
  const format = cliArgs.format;
  const debug = cliArgs.debug;

  // Set global variables
  global.root = __dirname;
  global.logger = logger;
  global.appData = appDataPath;
  global.isDebug = debug || false;
  global.logLevel = global.isDebug ? "debug" : "info";

  if (!existsSync(inputPath) || !statSync(inputPath).isFile()) {
    logger.error(`Provided path does not exist or it's not a file, please provide an ISO, WBFS, DOL or BIN file.`);
    process.exit(1);
  }

  if (platform == PLATFORMS.WII) {
    logger.info("Patching Wii game...");

    // Formats
    const ISO = require("./formats/wii/iso");
    const WBFS = require("./formats/wii//wbfs");
    const DOL = require("./formats/wii/dol");

    switch (format.type) {
      case "ISO":
        await ISO({ game, gameId, region, version: game.version, inputFile: inputPath });
        break;
      case "WBFS":
        await WBFS({ game, gameId, region, version: game.version, inputFile: inputPath });
        break;
      case "DOL":
        await DOL({ game, gameId, region, version: game.version, inputFile: inputPath });
        break;
    };
  }
  else if (platform == "PS3") {
    logger.error("PS3 is not supported yet.");
    process.exit(1);
  };

  exit();
})();

process.on("unhandledRejection", (reason, p) => {
  logger.error(reason, "Unhandled Rejection at Promise", p);
  exit();
});

process.on("uncaughtException", err => {
  logger.error(err, "Uncaught Exception thrown");
  exit(1);
});