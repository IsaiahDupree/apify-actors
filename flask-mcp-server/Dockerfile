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

# Install Python and Flask for running the Flask MCP server
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip install flask

# Copy the Flask MCP application from your repository
COPY ./python-flask-mcp /app

# Set the working directory for the Flask app
WORKDIR /app

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Copy the rest of the actor's code
WORKDIR /

COPY . ./

# Run the actor
CMD ["node", "index.js"]
