FROM    ubuntu

# File Author / Maintainer
MAINTAINER Andrew Yang

# Install Node.js and other dependencies
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install python build-essential nodejs

# Upgrade Node.js
RUN npm -g install npm@latest

# Install nodemon
RUN npm install -g nodemon

# Set PORT environment variable
ENV PORT 8000
ENV DATABASEADDR database

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE  8000

# Run app using nodemon
CMD ["nodemon", "/src/app.js"]
