const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, data) => {
  const timestamp = getTimestamp();
  const baseMessage = `[${timestamp}] [${level}] ${message}`;
  return data ? `${baseMessage}\n${JSON.stringify(data, null, 2)}` : baseMessage;
};

const writeLog = (filename, message) => {
  const filepath = path.join(logsDir, filename);
  fs.appendFileSync(filepath, message + '\n');
};

const logger = {
  info: (message, data = null) => {
    const formattedMessage = formatMessage('INFO', message, data);
    console.log(formattedMessage);
    if (process.env.NODE_ENV === 'production') {
      writeLog('combined.log', formattedMessage);
    }
  },

  error: (message, data = null) => {
    const formattedMessage = formatMessage('ERROR', message, data);
    console.error(formattedMessage);
    writeLog('error.log', formattedMessage);
    if (process.env.NODE_ENV === 'production') {
      writeLog('combined.log', formattedMessage);
    }
  },

  warn: (message, data = null) => {
    const formattedMessage = formatMessage('WARN', message, data);
    console.warn(formattedMessage);
    if (process.env.NODE_ENV === 'production') {
      writeLog('combined.log', formattedMessage);
    }
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = formatMessage('DEBUG', message, data);
      console.log(formattedMessage);
    }
  },
};

module.exports = logger;