/**
 * Test script for Perplexity MCP Server
 * 
 * This is a simplified version for local testing without Apify dependencies
 */

import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

// Configuration
const SERVER_PORT = 3000;
const MCP_COMMAND = 'node ./lib/perplexity-mcp.js';

// Create Express app
const app = express();
app.use(cors());

// Set up SSE endpoint
app.get('/sse', (req, res) => {
    console.log('Client connected to SSE');
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
        console.log('Client disconnected from SSE');
    });
    
    // Add this client to our broadcast list
    clients.push(res);
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
        console.log(`Forwarded request to Perplexity MCP server: ${req.path}`);
    } else {
        console.error('Cannot forward request: Child process not available');
        res.status(500).json({ error: 'MCP server not available' });
    }
});

// Start the server
app.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
});

// Keep track of connected clients for broadcasting
const clients = [];

// Spawn the child process
const childProcess = spawn(MCP_COMMAND, { shell: true, env: { ...process.env } });

// Handle stdout from the child process
childProcess.stdout.on('data', (data) => {
    const message = data.toString();
    console.log(`MCP stdout: ${message}`);
    
    // Broadcast to all connected clients
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify({ type: 'stdout', message })}\n\n`);
    });
});

// Handle stderr from the child process
childProcess.stderr.on('data', (data) => {
    const message = data.toString();
    console.error(`MCP stderr: ${message}`);
    
    // Broadcast to all connected clients
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify({ type: 'stderr', message })}\n\n`);
    });
});

// Handle child process exit
childProcess.on('exit', (code) => {
    console.log(`MCP server exited with code ${code}`);
    
    // Notify all clients
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify({ type: 'exit', code })}\n\n`);
    });
});
