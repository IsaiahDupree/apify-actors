# Flask MCP Server Actor

This Actor provides a Model Context Protocol (MCP) server interface using Flask, allowing AI assistants to interact with your custom Flask-based MCP services.

## Features

- Runs as a standby Actor on the Apify platform
- Provides a Model Context Protocol (MCP) interface via Flask
- Runs on port 7072 for better isolation and scalability
- Real-time logs via Server-Sent Events (SSE)

## Usage

This Actor is designed to run in standby mode on the Apify platform. It will start a web server that forwards requests to the Flask MCP server running on port 7072.

### API Endpoints

The Actor exposes the following endpoints:

- `GET /sse` - Server-Sent Events endpoint for real-time logs
- `POST /api/*` - Forwards requests to the Flask MCP server

## Integration

This Actor integrates with the combined MCP architecture that includes:
- N8N components (primary node and worker node)
- Redis for queue management
- PostgreSQL for persistent storage
- Other MCP services like ArXiv and Perplexity
