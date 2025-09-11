    # Dockerfile
    FROM node:20

    # Set working directory
    WORKDIR /app

    # Copy package.json and package-lock.json
    COPY package*.json ./

    # Install dependencies
    RUN npm install

    # Copy the rest of the application code
    COPY . .

    # Expose the port the app runs on
    EXPOSE 8000

    # Start the application using Node.js
    CMD ["node", "server.js"]
