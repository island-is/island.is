FROM node:12.16.2-alpine3.11 as builder

WORKDIR /build

# Adding user for building the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /build
USER runner

# Adding and installing packages
ADD --chown=runner:runners package.json yarn.lock ./
RUN yarn

# Adding the rest of the code
ADD --chown=runner:runners . .
RUN yarn run build gjafakort-queue-listener --prod

FROM node:12.16.2-alpine3.11

RUN apk add bash -U && rm -rf /var/cache/apk/*
WORKDIR /webapp

# Adding user for running the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /webapp
USER runner

COPY --from=builder --chown=runner:runners /build/dist/apps/gjafakort/queue-listener /webapp
COPY --from=builder --chown=runner:runners /build/node_modules /webapp/node_modules

ENTRYPOINT [ "node" ]
CMD [ "main.js" ]
