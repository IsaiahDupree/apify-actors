# Perplexity MCP Server

This is a Model Context Protocol (MCP) server for the Perplexity API, designed to run as an Apify Actor. It allows AI assistants to search and access information using the Perplexity API through a standardized interface.

## Features

- Search using Perplexity's powerful search capabilities
- Chat completions with various Perplexity models
- Model listing
- Server-Sent Events (SSE) for real-time communication

## Setup

### Prerequisites

- Node.js 18 or higher
- Perplexity API key

### Environment Variables

The following environment variables are required:

- `PERPLEXITY_API_KEY`: Your Perplexity API key

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

### Running Locally

To run the MCP server locally:

```bash
npm run dev
```

## Deployment to Apify

This project is designed to be deployed as an Apify Actor. To deploy:

1. Create a new Actor on the Apify platform
2. Set the environment variables in the Actor settings
3. Deploy this codebase to the Actor

## API Endpoints

The MCP server exposes the following endpoints:

- `/search` (POST): Perform a search using Perplexity
- `/chat` (POST): Generate chat completions
- `/models` (GET): List available models

## Example Usage

### Search

```json
{
  "query": "What is the capital of France?",
  "search_focus": "internet"
}
```

### Chat

```json
{
  "messages": [
    {"role": "user", "content": "Tell me about quantum computing"}
  ],
  "model": "sonar-medium-online"
}
```

## License

MIT
