const inquirer = require("inquirer");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const fs = require("fs");

const project = require("../package.json");
const config = require("../config");
const utils = require("./utils");

const fixPath = (inputPath) => {
  return inputPath.trim().replace(/['"]+/g, '');
};

const getFileFormat = (filePath) => {
  const ext = path.extname(filePath);
  const basename = path.basename(filePath);
  const filename = path.basename(filePath, ext);

  const formatMap = {
    '.iso': 'ISO',
    '.wbfs': 'WBFS',
    '.dol': 'DOL',
    '.bin': 'BIN'
  };

  const type = formatMap[ext.toLowerCase()];

  if (!type) {
    return null;
  }

  return {
    filename: basename,
    name: filename,
    extension: ext,
    type
  };
};

const getScriptName = () => {
  return path.basename(process.argv[1]);
};

const getAvailableGamesForPlatform = (platform) => {
  const platformKey = platform.toLowerCase();
  return config.GAMES.filter(game =>
    game[platformKey] && game[platformKey].isAvailable
  ).sort((a, b) => a.version - b.version);
};

const listAvailableGames = (platform) => {
  const games = getAvailableGamesForPlatform(platform);
  if (games.length === 0) {
    return "No games available";
  }
  return games.map(g => `${g.version} (${g.name})`).join(", ");
};

const displayWarnings = (game, platform) => {
  const platformKey = platform.toLowerCase();
  const warnings = game[platformKey]?.warnings;
  
  if (warnings && warnings.length > 0) {
    console.log("\n⚠️  WARNING:");
    warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning}`);
    });
    console.log();
  }
};

const setupYargs = () => {
  return yargs(hideBin(process.argv))
    .scriptName(getScriptName())
    .usage(`Patcher for DanceParty (v${project.version})
${project.description}

Usage: $0 [options]

If no arguments are provided, the patcher will run in interactive mode.`)
    .option("platform", {
      alias: "p",
      type: "string",
      description: "Platform (wii or ps3)"
    })
    .option("game-version", {
      alias: "g",
      type: "number",
      description: "Game version (e.g., 2014, 2015, 2016)"
    })
    .option("id", {
      alias: "i",
      type: "string",
      description: "Game ID (e.g., SJOP41) - auto-detects platform and game"
    })
    .option("file", {
      alias: "f",
      type: "string",
      description: "Input file path (ISO/WBFS/DOL/BIN)"
    })
    .option("list", {
      alias: "l",
      type: "string",
      description: "List available games for a platform (wii or ps3)"
    })
    .example([
      ['$0 -l wii', 'List available Wii games'],
      ['$0 -i SJOP41 -f "./main.dol"', 'Patch using game ID (auto-detects platform/game)'],
      ['$0 -p wii -g 2014 -i SJOP41 -f "./main.dol"', 'Patch using platform and version'],
      ['$0 -p ps3 -g 2015 -f "./game.iso"', 'Patch a PS3 ISO'],
      ['$0', 'Start interactive mode']
    ])
    .help()
    .alias("h", "help")
    .version(project.version)
    .alias("v", "version")
    .parse();
};

const findGameByGameId = (gameId) => {
  const upperGameId = gameId.toUpperCase();

  for (const game of config.GAMES) {
    if (game.wii && game.wii.ids && game.wii.ids[upperGameId]) {
      return {
        game,
        platform: "WII",
        gameId: upperGameId,
        region: game.wii.ids[upperGameId].r,
        description: game.wii.ids[upperGameId].description // Added description
      };
    }
    // Add PS3 support if needed
    if (game.ps3 && game.ps3.ids && game.ps3.ids[upperGameId]) {
      return {
        game,
        platform: "PS3",
        gameId: upperGameId,
        region: game.ps3.ids[upperGameId].r,
        description: game.ps3.ids[upperGameId].description // Added description
      };
    }
  }

  return null;
};

module.exports = async () => {
  const argv = setupYargs();

  // Handle list command
  if (argv.list) {
    const platform = argv.list.toUpperCase();

    if (platform !== "WII" && platform !== "PS3") {
      console.error("\n❌ Error: Platform must be 'wii' or 'ps3'\n");
      process.exit(1);
    }

    console.log(`\nAvailable games for ${platform}:`);
    const games = getAvailableGamesForPlatform(platform);

    if (games.length === 0) {
      console.log("  No games available\n");
    } else {
      games.forEach(g => {
        console.log(`  ${g.version} - ${g.name}`);
        const platformKey = platform.toLowerCase();
        if (g[platformKey] && g[platformKey].ids) {
          const ids = Object.keys(g[platformKey].ids).map(id => {
            const idData = g[platformKey].ids[id];
            // NEW: Include description in the list output
            const desc = idData.description ? ` (${idData.description})` : '';
            return `${id} (${idData.r})${desc}`;
          }).join(", ");
          console.log(`    IDs: ${ids}`);
        }
      });
      console.log();
    }
    process.exit(0);
  }

  // Check if any CLI arguments were provided (excluding help/version/list)
  const hasCliArgs = argv.platform || argv.gameVersion || argv.id || argv.file;

  if (hasCliArgs) {
    // ... (File existence and format validation remains the same)
    if (!argv.file) {
      console.error("\n❌ Error: --file is required\n");
      process.exit(1);
    }

    // Check if file exists
    if (!fs.existsSync(argv.file)) {
      console.error(`\n❌ Error: File not found: ${argv.file}\n`);
      process.exit(1);
    }

    // Detect file format
    const format = getFileFormat(argv.file);
    if (!format) {
      console.error("\n❌ Error: Unsupported file format.");
      console.error("Supported formats: ISO, WBFS, DOL, BIN\n");
      process.exit(1);
    }

    let platform, selectedGame, gameId, region, description;

    // Case 1: Game ID provided (auto-detect everything)
    if (argv.id && !argv.platform && !argv.gameVersion) {
      const result = findGameByGameId(argv.id);

      if (!result) {
        console.error(`\n❌ Error: Game ID "${argv.id}" not found in any game.`);
        console.error("Use --list wii or --list ps3 to see available game IDs\n");
        process.exit(1);
      }

      if (!result.game[result.platform.toLowerCase()].isAvailable) {
        console.error(`\n❌ Error: Game "${result.game.name}" is not available for ${result.platform}.\n`);
        process.exit(1);
      }

      platform = result.platform;
      selectedGame = result.game;
      gameId = result.gameId;
      region = result.region;
      description = result.description; // NEW: Capture description

      console.log("\n✓ Auto-detected from game ID:");
      console.log(`  Platform: ${platform}`);
      console.log(`  Game: ${selectedGame.name} (v${selectedGame.version})`);
      // NEW: Show description if available
      const idDetails = description ? `${gameId} (${region}) - ${description}` : `${gameId} (${region})`;
      console.log(`  Game ID: ${idDetails}`);
      console.log(`  Input File: ${argv.file}`);
      console.log(`  Format: ${format.type} (${format.filename})`);
      
      // Display warnings if any
      displayWarnings(selectedGame, platform);
    }
    // Case 2: Platform and game version provided
    else if (argv.platform && argv.gameVersion) {
      platform = argv.platform.toUpperCase();

      if (platform !== "WII" && platform !== "PS3") {
        console.error("\n❌ Error: Platform must be 'wii' or 'ps3'\n");
        process.exit(1);
      }

      // Find the selected game by version
      selectedGame = config.GAMES.find(g => g.version === argv.gameVersion);

      if (!selectedGame) {
        console.error(`\n❌ Error: Game version "${argv.gameVersion}" not found.`);
        console.error(`\nAvailable versions for ${platform}: ${listAvailableGames(platform)}\n`);
        process.exit(1);
      }

      const platformKey = platform.toLowerCase();
      if (!selectedGame[platformKey] || !selectedGame[platformKey].isAvailable) {
        console.error(`\n❌ Error: Game "${selectedGame.name}" (v${argv.gameVersion}) is not available for ${platform}.`);
        console.error(`\nAvailable versions for ${platform}: ${listAvailableGames(platform)}\n`);
        process.exit(1);
      }

      // Handle Wii-specific validation
      if (platform === "WII") {
        if (!argv.id) {
          console.error("\n❌ Error: --id is required for Wii platform.");
          const availableIds = Object.keys(selectedGame.wii.ids).map(id => {
            const idData = selectedGame.wii.ids[id];
            const desc = idData.description ? ` (${idData.description})` : '';
            return `${id} (${idData.r})${desc}`;
          }).join(", ");
          console.error(`Available IDs for ${selectedGame.name}: ${availableIds}\n`);
          process.exit(1);
        }

        gameId = argv.id.toUpperCase();
        const idData = selectedGame.wii.ids[gameId];

        if (!idData) {
          const availableIds = Object.keys(selectedGame.wii.ids).map(id => {
            const idData = selectedGame.wii.ids[id];
            const desc = idData.description ? ` (${idData.description})` : '';
            return `${id} (${idData.r})${desc}`;
          }).join(", ");
          console.error(`\n❌ Error: Game ID "${gameId}" not found for this game.`);
          console.error(`Available IDs: ${availableIds}\n`);
          process.exit(1);
        }

        region = idData.r;
        description = idData.description; // NEW: Capture description
      }

      console.log("\n✓ Using CLI arguments:");
      console.log(`  Platform: ${platform}`);
      console.log(`  Game: ${selectedGame.name} (v${argv.gameVersion})`);
      if (gameId) {
        // NEW: Show description if available
        const idDetails = description ? `${gameId} (${region}) - ${description}` : `${gameId} (${region})`;
        console.log(`  Game ID: ${idDetails}`);
      }
      console.log(`  Input File: ${argv.file}`);
      console.log(`  Format: ${format.type} (${format.filename})`);
      
      // Display warnings if any
      displayWarnings(selectedGame, platform);
    }
    // Case 3: Invalid combination
    else {
      console.error("\n❌ Error: Invalid argument combination.");
      console.error("\nValid usage:");
      console.error("  1. Provide only --id and --file (auto-detects platform and game)");
      console.error("  2. Provide --platform, --game-version, and --file");
      console.error("     For Wii: also provide --id\n");
      process.exit(1);
    }

    return {
      platform,
      selectedGame,
      ...(gameId && { gameId }),
      ...(region && { region }),
      format,
      inputFile: argv.file
    };
  }

  // Interactive mode
  console.log();
  console.log(`Patcher for DanceParty (v${project.version})`);
  console.log(project.description);
  console.log("---------------------------------\n");

  try {
    // Ask for platform selection
    const { platform } = await inquirer.prompt([
      {
        type: "list",
        name: "platform",
        message: "Select a platform:",
        choices: [
          { name: "Wii", value: "WII" },
          { name: "PS3", value: "PS3" }
        ]
      }
    ]);

    // Get available games for selected platform
    const availableGames = getAvailableGamesForPlatform(platform);

    if (availableGames.length === 0) {
      console.error(`\nNo available games found for ${platform}.\n`);
      process.exit(1);
    }

    // Ask for game selection
    const { selectedGame } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedGame",
        message: "Select a game:",
        choices: availableGames.map(g => ({
          name: `${g.name}`,
          value: g
        }))
      }
    ]);

    // Display warnings immediately after game selection
    displayWarnings(selectedGame, platform);

    // Ask for region/game ID if Wii platform is selected
    let gameId = null;
    let region = null;
    let description = null;
    if (platform === "WII") {
      const gameIds = Object.keys(selectedGame.wii.ids);

      const gameIdPrompt = await inquirer.prompt([
        {
          type: "list",
          name: "gameId",
          message: "Select a game ID (region):",
          choices: gameIds.map(id => {
            const idData = selectedGame.wii.ids[id];
            const regionValue = idData.r;
            // NEW: Include description in the interactive prompt
            const desc = idData.description ? ` - ${idData.description}` : '';
            return {
              name: `${id} (${regionValue})${desc}`,
              value: id
            };
          })
        }
      ]);

      gameId = gameIdPrompt.gameId;
      const idData = selectedGame.wii.ids[gameId];
      region = idData.r;
      description = idData.description;
    }

    // Ask for input file
    const { inputPath } = await inquirer.prompt([
      {
        type: "input",
        name: "inputPath",
        message: "Enter the path to your input file (ISO/WBFS/DOL/BIN):",
        validate: (input) => {
          if (!input || input.trim() === "") {
            return "Please provide a valid file path.";
          }
          const cleanPath = fixPath(input);
          if (!fs.existsSync(cleanPath)) {
            return "File does not exist. Please provide a valid file path.";
          }
          const format = getFileFormat(cleanPath);
          if (!format) {
            return "Unsupported file format. Please provide an ISO, WBFS, DOL, or BIN file.";
          }
          return true;
        }
      }
    ]);

    const trimmedPath = fixPath(inputPath);
    const format = getFileFormat(trimmedPath);

    // Return the collected arguments
    return {
      platform,
      selectedGame,
      ...(gameId && { gameId }),
      ...(region && { region }),
      format,
      inputFile: trimmedPath
    };
  } catch (error) {
    if (error.isTtyError) {
      console.error("\nPrompt couldn't be rendered in the current environment.\n");
    } else {
      console.error("\nAn error occurred:", error.message, "\n");
    }
    process.exit(1);
  }
};