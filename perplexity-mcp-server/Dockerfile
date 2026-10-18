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

# Copy the rest of the application
COPY . ./

# Set environment variables
ENV APIFY_DISABLE_OUTDATED_WARNING=1
ENV PERPLEXITY_API_KEY=${PERPLEXITY_API_KEY}

# Run the application
CMD ["node", "index.js"]
