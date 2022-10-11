FROM node:14 as dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

FROM node:14 as builder
ARG ENV
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build-$ENV

FROM node:14 as runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next-boost.js ./next-boost.js
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
CMD yarn start

