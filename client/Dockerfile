# FROM node:18.16
# WORKDIR /app
# COPY . .
# RUN npm install --force
# EXPOSE 3000
# CMD ["npm","start"]

FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY build/ /usr/share/nginx/html 
EXPOSE 3000