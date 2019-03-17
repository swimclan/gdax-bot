FROM node:latest
WORKDIR /opt/node/algo-mania
COPY package*.json ./
RUN npm install -g webpack webpack-cli
RUN npm install
COPY . .
CMD [ "npm", "start" ]