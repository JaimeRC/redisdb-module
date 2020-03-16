FROM node:10-alpine
EXPOSE 5050

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY . .
RUN npm install

CMD [ "npm", "run", "test" ]
