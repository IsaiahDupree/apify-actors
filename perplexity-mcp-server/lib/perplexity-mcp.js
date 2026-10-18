/**
 * Perplexity MCP Server Implementation
 * 
 * This file implements the Model Context Protocol (MCP) server for Perplexity API.
 * It handles incoming requests, forwards them to the Perplexity API, and returns the results.
 */

import readline from 'readline';
import fetch from 'node-fetch';

// Create readline interface for reading from stdin
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// Configuration
const PERPLEXITY_API_URL = 'https://api.perplexity.ai';
const DEFAULT_MODEL = 'sonar-small-online';

// Get API key from environment variable
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Check if API key is available
if (!PERPLEXITY_API_KEY) {
    console.error('PERPLEXITY_API_KEY environment variable is not set');
    process.exit(1);
}

// MCP server implementation
class PerplexityMcpServer {
    constructor() {
        this.setupRoutes();
    }

    setupRoutes() {
        // Listen for incoming requests from stdin
        rl.on('line', async (line) => {
            try {
                const request = JSON.parse(line);
                await this.handleRequest(request);
            } catch (error) {
                console.error('Error processing request:', error);
                this.sendResponse({
                    status: 500,
                    body: { error: 'Internal server error' }
                });
            }
        });

        console.log('Perplexity MCP server started');
    }

    async handleRequest(request) {
        const { path, method, body } = request;

        // Route the request based on the path
        if (path === '/search' && method === 'POST') {
            await this.handleSearch(body);
        } else if (path === '/chat' && method === 'POST') {
            await this.handleChat(body);
        } else if (path === '/models' && method === 'GET') {
            await this.handleListModels();
        } else {
            this.sendResponse({
                status: 404,
                body: { error: 'Not found' }
            });
        }
    }

    async handleSearch(body) {
        try {
            const { query } = body;
            
            if (!query) {
                return this.sendResponse({
                    status: 400,
                    body: { error: 'Query is required' }
                });
            }

            // Call Perplexity API for search
            const response = await fetch(`${PERPLEXITY_API_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
                },
                body: JSON.stringify({
                    query,
                    focus: body.focus || [],
                    search_focus: body.search_focus || 'internet',
                    timezone: body.timezone || 'America/New_York'
                })
            });

            const data = await response.json();
            
            this.sendResponse({
                status: response.status,
                body: data
            });
        } catch (error) {
            console.error('Error in search:', error);
            this.sendResponse({
                status: 500,
                body: { error: 'Failed to perform search' }
            });
        }
    }

    async handleChat(body) {
        try {
            const { messages, model } = body;
            
            if (!messages || !Array.isArray(messages)) {
                return this.sendResponse({
                    status: 400,
                    body: { error: 'Messages array is required' }
                });
            }

            // Call Perplexity API for chat
            const response = await fetch(`${PERPLEXITY_API_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
                },
                body: JSON.stringify({
                    model: model || DEFAULT_MODEL,
                    messages,
                    stream: false
                })
            });

            const data = await response.json();
            
            this.sendResponse({
                status: response.status,
                body: data
            });
        } catch (error) {
            console.error('Error in chat:', error);
            this.sendResponse({
                status: 500,
                body: { error: 'Failed to complete chat' }
            });
        }
    }

    async handleListModels() {
        try {
            // Return available models
            // Note: This is a simplified implementation
            this.sendResponse({
                status: 200,
                body: {
                    data: [
                        { id: 'sonar-small-online', name: 'Sonar Small Online' },
                        { id: 'sonar-medium-online', name: 'Sonar Medium Online' },
                        { id: 'mistral-7b-instruct', name: 'Mistral 7B Instruct' },
                        { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct' },
                        { id: 'llama-3-8b-instruct', name: 'Llama 3 8B Instruct' },
                        { id: 'llama-3-70b-instruct', name: 'Llama 3 70B Instruct' }
                    ]
                }
            });
        } catch (error) {
            console.error('Error listing models:', error);
            this.sendResponse({
                status: 500,
                body: { error: 'Failed to list models' }
            });
        }
    }

    sendResponse(response) {
        // Send response to stdout
        console.log(JSON.stringify(response));
    }
}

// Start the MCP server
new PerplexityMcpServer();
