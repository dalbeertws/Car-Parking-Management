FROM node:16
WORKDIR /carfrontend/
COPY package*.json ./
RUN npm install --force
# Update Browserslist database

RUN npm install --save-dev ajv@^7 --force
COPY . .
COPY .env /carfrontend/
EXPOSE 3000
CMD [ "npm","start" ]
