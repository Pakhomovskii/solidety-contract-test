
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install -g truffle ganache && npm install

COPY . .

RUN truffle compile --all

CMD ganache-cli -m "test test test test test test test test test test test junk" -e 1000 > /dev/null & \
    sleep 5 && truffle test

