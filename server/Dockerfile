# Используйте официальный образ Node.js
FROM node:latest

# Install MongoDB client and tools
RUN apt-get update && \
    apt-get install -y mongodb-clients mongodb-server && \
    rm -rf /var/lib/apt/lists/*

# Установите рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируйте зависимости и установите их
COPY package*.json ./
RUN npm install

# Копируйте все файлы в контейнер
COPY . .

# Укажите порт, который будет использоваться вашим Express-приложением
EXPOSE 3000

# Запустите ваше приложение
CMD service mongodb start && npm start
