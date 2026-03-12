# 1. Base image (using alpine for significantly smaller size)
FROM node:20-alpine

# 2. Set environment to production
ENV NODE_ENV=production

# 3. Create app directory and set ownership to non-root user
WORKDIR /usr/src/app

# 4. Install build dependencies (if any are needed for native modules)
# RUN apk add --no-cache python3 make g++

# 5. Optimization: Copy package files first to leverage Docker layer caching
# This step only re-runs if package.json or package-lock.json changes
COPY package*.json ./

# 6. Use 'npm ci' for faster, reliable, and reproducible production installs
RUN npm ci --only=production

# 7. Copy the rest of the application source code
COPY --chown=node:node . .

# 8. Use a non-root user for security (provided by official node images)
USER node

# 9. Expose port 5000
EXPOSE 5000

# 10. Start the application using a production-ready command
# Using node directly instead of npm scripts is generally preferred in production
CMD [ "node", "index.js" ]
