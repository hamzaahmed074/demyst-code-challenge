FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm link

CMD ["demyst-todo-cli", "fetch"]
