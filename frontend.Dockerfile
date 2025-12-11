# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS build

ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:1.27-alpine

RUN apk add --no-cache curl
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
