FROM node:18-bullseye

COPY package.json .
RUN npm i
COPY . .
RUN npm run build

CMD npm start
