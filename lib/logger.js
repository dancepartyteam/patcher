// Taken from DP Gameserver library but modified
const winston = require("winston");
const path = require("path");
const fs = require("fs");

const currentDate = (now = new Date()) => {
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};

// Determine log directory based on whether running in pkg or not
const getLogDir = () => {
    if (process.pkg) {
        // Running in PKG mode - use %APPDATA%
        const appDataPath = path.resolve(
            process.env.APPDATA ||
            (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"),
            require("./package.json").name || "patcher"
        );
        const logDir = path.join(appDataPath, "logs");
        fs.mkdirSync(logDir, { recursive: true });
        return logDir;
    } else {
        // Not in PKG mode - use local logs folder
        fs.mkdirSync("./logs", { recursive: true });
        return "./logs";
    }
};

const logDir = getLogDir();

const levels = {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    debug: 4
};

const colors = {
    error: "red",
    warn: "yellow",
    success: "green",
    info: "cyan",
    debug: "white"
};

winston.addColors(colors);

const level = global.logLevel || "info";

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
    ),
);

const transports = [
    new winston.transports.Console(),
    // Always write logs to file (in appropriate directory)
    new winston.transports.File({ 
        filename: path.join(logDir, `${currentDate()}.log`)
    })
];

const logger = winston.createLogger({
    level,
    levels,
    format,
    transports
});

module.exports = logger;