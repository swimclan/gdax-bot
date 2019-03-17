FROM node:latest
WORKDIR /opt/node/algo-mania
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]