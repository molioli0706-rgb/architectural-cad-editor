/**
 * Sistema de logging centralizado
 * Facilita debugging y monitoreo en desarrollo
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

const isDevelopment = process.env.NODE_ENV === "development";

class Logger {
  private prefix: string;

  constructor(context: string) {
    this.prefix = `[${context}]`;
  }

  private formatMessage(level: LogLevel, message: string): string {
    return `${this.prefix} ${new Date().toISOString()} - ${level}: ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (isDevelopment) {
      console.log(this.formatMessage(LogLevel.DEBUG, message), data);
    }
  }

  info(message: string, data?: unknown): void {
    console.log(this.formatMessage(LogLevel.INFO, message), data);
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage(LogLevel.WARN, message), data);
  }

  error(message: string, error?: unknown): void {
    console.error(this.formatMessage(LogLevel.ERROR, message), error);
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}

export default createLogger;
