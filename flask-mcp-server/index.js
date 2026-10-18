/**
 * Flask MCP Server - Main Entry Point
 *
 * This file serves as the entry point for the Flask MCP Server Actor.
 * It sets up a proxy server that forwards requests to the locally running
 * Flask MCP server, which provides a Model Context Protocol (MCP) interface
 * for AI assistants to access Flask-based MCP services.
 */

// Apify SDK - toolkit for building Apify Actors
import { Actor, log } from 'apify';
import { stdioToSse } from './lib/server.js';
import { getLogger } from './lib/getLogger.js';

// Configuration constants for the MCP server
// Command to run the Flask MCP server
const MCP_COMMAND = 'python -m flask run --host=0.0.0.0 --port=7072';

// Check if the Actor is running in standby mode
const STANDBY_MODE = process.env.APIFY_META_ORIGIN === 'STANDBY';
const SERVER_PORT = parseInt(process.env.ACTOR_WEB_SERVER_PORT || '', 10);

// Logger configuration
const LOG_LEVEL = 'info';
const OUTPUT_TRANSPORT = 'sse';

// Initialize the Apify Actor environment
await Actor.init();

// Charge for Actor start
await Actor.charge({ eventName: 'actor-start' });

if (!STANDBY_MODE) {
    // If the Actor is not in standby mode, we should not run the MCP server
    const msg = 'This Actor is not meant to be run directly. It should be run in standby mode.';
    log.error(msg);
    await Actor.exit({ statusMessage: msg });
}

const logger = getLogger({
    logLevel: LOG_LEVEL,
    outputTransport: OUTPUT_TRANSPORT,
});

await stdioToSse({
    port: SERVER_PORT,
    stdioCmd: MCP_COMMAND,
    logger,
});
