# Используйте официальный образ Node.js
FROM node:latest

RUN apt-get update && apt-get install -y mongodb

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
