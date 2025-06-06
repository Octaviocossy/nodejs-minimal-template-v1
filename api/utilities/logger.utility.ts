import path from 'path';

import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';

  return isDevelopment ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define the format for the logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Define which transports the logger must use
const getTransports = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';

  const transports: winston.transport[] = [
    // Console transport
    new winston.transports.Console(),
  ];

  // Add file transports only in development
  if (isDevelopment) {
    transports.push(
      // File transport for all logs
      new winston.transports.File({
        filename: path.join('logs', 'all.log'),
      }),
      // File transport for error logs
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
      })
    );
  }

  return transports;
};

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: getTransports(),
});

export { logger };
