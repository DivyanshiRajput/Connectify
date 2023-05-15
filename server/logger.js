import { createLogger, format, transports, config } from "winston";
const { combine, timestamp, json } = format;

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "../var/log/app.log", timestamp: true }),
  ],
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    json()
  ),
});

export default logger;
