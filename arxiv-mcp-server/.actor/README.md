# ArXiv MCP Server Actor

This Actor provides a Model Context Protocol (MCP) server interface for ArXiv, allowing AI assistants to search and access papers from the ArXiv repository.

## Features

- Runs as a standby Actor on the Apify platform
- Provides a Model Context Protocol (MCP) interface for ArXiv
- Allows searching and retrieving papers from ArXiv
- Real-time logs via Server-Sent Events (SSE)

## Usage

This Actor is designed to run in standby mode on the Apify platform. It will start a web server that forwards requests to the ArXiv MCP server.

### API Endpoints

The Actor exposes the following endpoints:

- `GET /sse` - Server-Sent Events endpoint for real-time logs
- `POST /api/*` - Forwards requests to the ArXiv MCP server

## Integration

This Actor integrates with the combined MCP architecture that includes:
- N8N components (primary node and worker node)
- Redis for queue management
- PostgreSQL for persistent storage
- Flask MCP service on port 7072
