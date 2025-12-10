require("dotenv").config();

const { resolve } = require("path");
const { existsSync, statSync, mkdirSync } = require("fs");

const project = require("./package.json");
const cli = require("./lib/cli");
const utils = require("./lib/utils");
const logger = require("./lib/logger");

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

  // Call CLI
  const args = cli();

  // Set global variables
  global.root = __dirname;
  global.logger = logger;
  global.project = project;
  global.appData = appDataPath;
  global.args = args;
  global.isDebug = (args.debug && args.debug == true) || false;
  global.logLevel = global.isDebug ? "debug" : "info";

  const Games = require("./lib/games");

  // Formats
  const ISO = require("./formats/wii/iso");
  const WBFS = require("./formats/wii//wbfs");
  const DOL = require("./formats/wii/dol");

  const inputPath = args["_"][0]; // Input file
  if (!existsSync(inputPath) || !statSync(inputPath).isFile()) {
    logger.error(`Provided path does not exist or it's not a file, please provide an ISO, WBFS, DOL or BIN file.`);
    process.exit(1);
  }

  // Detect format of input file
  // If input is DOL it will also find it's jdVersion via dol-game-finder lib
  const detectedFormat = await utils.detectFormat(inputPath);
  if (!detectedFormat) {
    logger.error(`Couldn't detect the format of the input file, please provide an ISO, WBFS, DOL or BIN file.`);
    process.exit(1);
  };

  const { format, gameId, version } = detectedFormat;
  const games = new Games();

  let game;
  let region;

  // DOL file can only detect jdVersion, not region
  if (format == "DOL") {
    game = games.getGameByVersion(version);
    logger.info(`Detected format: ${format}`);
    logger.info(`Detected game: ${game.version}`);
  }
  // WBFS and ISO
  else {
    game = games.getGameById(gameId);
    region = game.ids[gameId].r;
    logger.info(`Detected format: ${format}`);
    logger.info(`Detected game: ${game.version} / ${gameId} (${region})`);
  };

  switch (format) {
    case "ISO":
      await ISO({ game, gameId, region, version: game.version, inputFile: inputPath });
      break;
    case "WBFS":
      await WBFS({ game, gameId, region, version: game.version, inputFile: inputPath });
      break;
    case "DOL":
      await DOL({ game, version: game.version, inputFile: inputPath });
      break;
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