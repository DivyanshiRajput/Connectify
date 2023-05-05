import { createLogger, format, transports, config } from "winston";
const { combine, timestamp, json } = format;

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "../logs/app.log", timestamp: true }),
  ],
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    json()
  ),
});

export default logger;
