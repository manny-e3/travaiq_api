import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Configure the Winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // capture stack trace
        logFormat
    ),
    transports: [
        // 1. Console for development
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        }),
        // 2. Persistent file for all logs
        new winston.transports.File({
            filename: path.join('logs', 'combined.log')
        }),
        // 3. Persistent file for errors only
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error'
        })
    ]
});

export default logger;
