import * as fs from "fs";

function logToFile(message: string) {
  const logStream = fs.createWriteStream("api.log", { flags: "a" });
  logStream.write(`${message}\n`);
  logStream.end();
}

const logger = {
  info: (message: string) => logToFile(`[INFO] ${message}`),
  warn: (message: string) => logToFile(`[WARN] ${message}`),
  error: (message: string) => logToFile(`[ERROR] ${message}`),
};

export default logger;
