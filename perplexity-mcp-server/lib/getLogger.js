/**
 * Logger utility for the Perplexity MCP Server
 * 
 * This module provides a configurable logger that can output to different transports.
 */

/**
 * Creates a logger instance with the specified configuration
 * @param {Object} options Logger configuration options
 * @param {string} options.logLevel Log level (debug, info, warn, error)
 * @param {string} options.outputTransport Output transport (console, sse)
 * @returns {Object} Logger instance
 */
export function getLogger({ logLevel = 'info', outputTransport = 'console' }) {
    // Log levels and their numeric values
    const LOG_LEVELS = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    };
    
    // Current log level
    const currentLevel = LOG_LEVELS[logLevel] || LOG_LEVELS.info;
    
    // Create logger functions for each level
    const logger = {};
    
    Object.keys(LOG_LEVELS).forEach((level) => {
        logger[level] = (message) => {
            // Only log if the message's level is >= the current level
            if (LOG_LEVELS[level] >= currentLevel) {
                const timestamp = new Date().toISOString();
                const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                
                if (outputTransport === 'sse') {
                    // For SSE, we just log to console for now
                    // In a real implementation, this would send to SSE clients
                    console[level === 'error' ? 'error' : 'log'](formattedMessage);
                } else {
                    // Default to console
                    console[level === 'error' ? 'error' : 'log'](formattedMessage);
                }
            }
        };
    });
    
    return logger;
}
