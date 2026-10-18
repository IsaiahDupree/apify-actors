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
# The API key will be passed in at runtime from Apify secrets
# ENV PERPLEXITY_API_KEY=your_api_key_here

# Run the application
CMD ["node", "index.js"]
