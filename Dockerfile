FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/uploads

EXPOSE 8080
CMD ["npm", "run", "start-app"]
