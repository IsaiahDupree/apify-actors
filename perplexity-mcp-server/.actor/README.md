# Perplexity MCP Server Actor

This Actor provides a Model Context Protocol (MCP) server interface for Perplexity API, allowing AI assistants to search and access information through Perplexity.

## Features

- Runs as a standby Actor on the Apify platform
- Provides a Model Context Protocol (MCP) interface for Perplexity API
- Supports search, chat completion, and model listing operations
- Real-time logs via Server-Sent Events (SSE)

## Usage

This Actor is designed to run in standby mode on the Apify platform. It will start a web server that forwards requests to the Perplexity API.

### Input Configuration

The Actor requires the following environment variables:

- `PERPLEXITY_API_KEY` - Your Perplexity API key (store this as a secret in Apify)

### API Endpoints

The Actor exposes the following endpoints:

- `GET /sse` - Server-Sent Events endpoint for real-time logs
- `POST /api/search` - Search using Perplexity API
- `POST /api/chat` - Chat completion using Perplexity API
- `GET /api/models` - List available models

## Security Note

Please ensure your Perplexity API key is stored securely as an Apify secret and not hardcoded in your code or Dockerfile.
