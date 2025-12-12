const fs = require("fs");
const fse = require('fs-extra');
const path = require("path");
const utils = require('util');
const os = require("node:os");
const child_exec = utils.promisify(require('child_process').exec);
const chmod = utils.promisify(fs.chmod);

class ChildProcess {
  constructor() {};

  async findWine() {
    const possiblePaths = [
      'wine64',
      'wine',
      '/usr/local/bin/wine64',
      '/usr/local/bin/wine',
      '/opt/homebrew/bin/wine64',
      '/opt/homebrew/bin/wine',
      '/usr/bin/wine64',
      '/usr/bin/wine'
    ];

    for (const winePath of possiblePaths) {
      try {
        await child_exec(`which ${winePath}`);
        return winePath;
      } catch (error) {
        // Continue to next path
      }
    }

    // Try using 'which' command as fallback
    try {
      const { stdout } = await child_exec('which wine64 || which wine');
      return stdout.trim();
    } catch (error) {
      return null;
    }
  }

  async exec(execPath, command) {
    let execName = path.basename(execPath);
    let execFolder = path.dirname(execPath);
    const isMac = process.platform === 'darwin';
    const isWindows = process.platform === 'win32';
    let wineCommand = '';

    // Check if we need Wine (macOS running .exe files)
    if (isMac && (execName.endsWith('.exe') || execName.endsWith('.EXE'))) {
      logger.warn('You are on macOS - Wine will be used to run Windows executables!');
      
      const winePath = await this.findWine();
      if (!winePath) {
        throw new Error('Wine is not installed. Please install Wine to run Windows executables on macOS.\nInstall via Homebrew: brew install --cask wine-stable');
      }
      
      logger.debug(`Found Wine at: ${winePath}`);
      wineCommand = `${winePath} `;
    }

    // avoid the workaround if the parent process is not pkg-ed version.
    if (process.pkg) {
      // creating a temporary folder for our executable file
      const tmp = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
      const tmpFolder = path.join(tmp, path.relative(global.root, execFolder));
      const tmpExecPath = path.join(tmpFolder, execName);
      logger.debug(`exec path copying... tmp folder: ${tmpFolder}`);
      fse.copySync(execFolder, tmpFolder, { force: true, recursive: true });
      execPath = tmpExecPath;
      execFolder = tmpFolder;
      
      if (!isWindows) {
        await chmod(tmpExecPath, 0o765); // grant permission just in case
      }
    }

    // using {detached: true}, execute the command independently of its parent process
    // to avoid the main parent process' failing if the child process failed as well.
    const fullCommand = `${wineCommand}${execPath} ${command}`;
    
    return { 
      isPkg: process.pkg, 
      execPath, 
      execFolder, 
      execName,
      isMac,
      isWindows,
      usingWine: !!wineCommand,
      exec: await child_exec(fullCommand)
    };
  }
}

module.exports = new ChildProcess();