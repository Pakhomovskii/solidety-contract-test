# Базовый образ с Node.js
FROM node:16

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем и устанавливаем зависимости
COPY package*.json ./
RUN npm install -g truffle ganache && npm install

# Копируем остальной код
COPY . .

# Компилируем контракты
RUN truffle compile --all

CMD ganache-cli -m "test test test test test test test test test test test junk" -e 1000 > /dev/null & \
    sleep 5 && truffle test

