FROM node:22-alpine3.19

WORKDIR /usr/src/app

COPY package.json package-lock.json .swcrc tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
