# Используйте официальный образ Node.js
FROM node:latest

# Установка MongoDB
RUN apt-get update && \
    apt-get install -y gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/5.0 main" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    rm -rf /var/lib/apt/lists/*

# Установите рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируйте зависимости и установите их
COPY package*.json ./
RUN npm install

# Копируйте все файлы в контейнер
COPY . .

# Укажите порт, который будет использоваться вашим Express-приложением
EXPOSE $PORT

# Запустите ваше приложение
CMD service mongodb start && npm start

# Запуск MongoDB и приложения
CMD mongod --fork --logpath /var/log/mongodb.log && npm start
