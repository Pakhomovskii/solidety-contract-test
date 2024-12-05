FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g truffle ganache-cli

RUN npm install

COPY . .

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

ENV NODE_ENV=development

CMD ["start.sh"]
