# MCP Server Actors for Apify

This repository contains three Model Context Protocol (MCP) server actors for deployment on the Apify platform:

## Perplexity MCP Server

An Apify actor that provides a Model Context Protocol (MCP) interface for the Perplexity API, allowing AI assistants to search and access information through Perplexity.

- Located in: `/perplexity-mcp-server`
- Features: Search, chat completion, and model listing operations

## ArXiv MCP Server

An Apify actor that provides a Model Context Protocol (MCP) interface for ArXiv, allowing AI assistants to search and access papers from the ArXiv repository.

- Located in: `/arxiv-mcp-server`
- Features: Paper search and retrieval from ArXiv

## Flask MCP Server

An Apify actor that provides a Model Context Protocol (MCP) interface using Flask, allowing AI assistants to interact with custom Flask-based MCP services.

- Located in: `/flask-mcp-server`
- Features: Custom MCP endpoints running on port 7072

## Architecture

These actors are part of a larger architecture that includes:
- N8N components (primary node on port 6679 and worker node)
- Redis for queue management
- PostgreSQL for persistent storage
- Multiple MCP servers for different capabilities

## Deployment

Each actor is designed to run in standby mode on the Apify platform. See the individual README files in each actor's directory for specific deployment instructions.

## Integration

These MCP servers can be integrated with your N8N workflows to provide AI assistants with access to various data sources and services.
