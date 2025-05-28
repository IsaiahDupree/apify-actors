/**
 * Server utility for handling SSE communication
 * 
 * This module provides functionality to convert standard I/O from a child process
 * to Server-Sent Events (SSE) for real-time communication with clients.
 */

import { spawn } from 'child_process';
import express from 'express';
import cors from 'cors';

/**
 * Converts stdio from a child process to SSE events
 * @param {Object} options Configuration options
 * @param {number} options.port Port to run the server on
 * @param {string} options.stdioCmd Command to execute in the child process
 * @param {Object} options.logger Logger instance
 * @returns {Promise<void>} Promise that resolves when the server is started
 */
export async function stdioToSse({ port, stdioCmd, logger }) {
    const app = express();
    app.use(cors());
    
    // Set up SSE endpoint
    app.get('/sse', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Send a comment to keep the connection alive
        const keepAlive = setInterval(() => {
            res.write(': keepalive\n\n');
        }, 15000);
        
        // Clean up on client disconnect
        req.on('close', () => {
            clearInterval(keepAlive);
            logger.info('Client disconnected from SSE');
        });
        
        // Add this client to our broadcast list
        clients.push(res);
        logger.info('Client connected to SSE');
    });
    
    // Set up API endpoint to forward requests to the MCP server
    app.use(express.json({ limit: '50mb' }));
    app.post('/api/*', (req, res) => {
        // Forward the request to the MCP server via stdin
        const message = JSON.stringify({
            path: req.path.replace('/api', ''),
            method: req.method,
            headers: req.headers,
            body: req.body,
        });
        
        if (childProcess && childProcess.stdin.writable) {
            childProcess.stdin.write(message + '\n');
            logger.info(`Forwarded request to ArXiv MCP server: ${req.path}`);
        } else {
            logger.error('Cannot forward request: Child process not available');
            res.status(500).json({ error: 'ArXiv MCP server not available' });
        }
    });
    
    // Start the server
    app.listen(port, () => {
        logger.info(`ArXiv MCP server running on port ${port}`);
    });
    
    // Keep track of connected clients for broadcasting
    const clients = [];
    
    // Spawn the child process
    const childProcess = spawn(stdioCmd, { shell: true });
    
    // Handle stdout from the child process
    childProcess.stdout.on('data', (data) => {
        const message = data.toString();
        logger.debug(`ArXiv MCP stdout: ${message}`);
        
        // Broadcast to all connected clients
        clients.forEach((client) => {
            client.write(`data: ${JSON.stringify({ type: 'stdout', message })}\n\n`);
        });
    });
    
    // Handle stderr from the child process
    childProcess.stderr.on('data', (data) => {
        const message = data.toString();
        logger.debug(`ArXiv MCP stderr: ${message}`);
        
        // Broadcast to all connected clients
        clients.forEach((client) => {
            client.write(`data: ${JSON.stringify({ type: 'stderr', message })}\n\n`);
        });
    });
    
    // Handle child process exit
    childProcess.on('exit', (code) => {
        logger.info(`ArXiv MCP server exited with code ${code}`);
        
        // Notify all clients
        clients.forEach((client) => {
            client.write(`data: ${JSON.stringify({ type: 'exit', code })}\n\n`);
        });
    });
}
