FROM apify/actor-node:18

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install NPM packages, skip optional and development dependencies to keep the image small
RUN npm --quiet set progress=false \
    && npm install --only=prod --no-optional \
    && echo "Installed NPM packages:" \
    && (npm list || true) \
    && echo "Node.js version:" \
    && node --version \
    && echo "NPM version:" \
    && npm --version

# Install Python and uv package manager for running the ArXiv MCP server
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip install uv

# Install the ArXiv MCP server
RUN uv pip install arxiv-mcp-server

# Copy the rest of the actor's code
COPY . ./

# Run the actor
CMD ["node", "index.js"]
