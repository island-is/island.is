FROM node:12-alpine3.12 as runner

RUN apk add postgresql-client bash

FROM node:12-alpine3.12 as build

ADD package.json yarn.lock /app/
WORKDIR /app
RUN yarn install --frozen-lockfile

ADD tsconfig.json /app/
ADD src /app/src/

RUN ./node_modules/.bin/ncc build src/feature-env.ts -o /app/dist/feature-env
RUN ./node_modules/.bin/ncc build src/secrets.ts -o /app/dist/secrets
RUN ./node_modules/.bin/ncc build src/pull-request.ts -o /app/dist/pull-request

FROM runner

COPY --from=build /app/dist/ /app
COPY scripts/container-scripts/* ./app/
WORKDIR /app

CMD [ "node", "feature-env.js" ]