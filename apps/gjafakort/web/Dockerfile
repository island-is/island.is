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
RUN yarn run build gjafakort-web --prod

FROM node:12.16.2-alpine3.11

ARG GIT_BRANCH
ARG GIT_SHA
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_SHA=${GIT_SHA}

RUN apk add bash -U && rm -rf /var/cache/apk/*
WORKDIR /webapp

# Adding user for running the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /webapp
USER runner

COPY --from=builder --chown=runner:runners /build/node_modules /webapp/node_modules
COPY --from=builder --chown=runner:runners /build/apps/gjafakort/web/next.config.js /webapp
COPY --from=builder --chown=runner:runners /build/apps/gjafakort/web/public /webapp/public
COPY --from=builder --chown=runner:runners /build/dist/apps/gjafakort/web /webapp/.next

ENTRYPOINT [ "npx", "next", "start", "-p", "4200" ]
