# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json /usr/src/app

# Install any dependencies
RUN npm install

# Copy the compiled JavaScript code and any other necessary files into the container
# COPY /dist/ .
COPY . .

# Your app binds to port 4000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 4001

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "bot.js" ]
