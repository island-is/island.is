FROM node:12.16.2-alpine3.11 as deps
WORKDIR /build

# Adding user for building the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /build
USER runner

# Adding and installing packages
ADD --chown=runner:runners package.json yarn.lock ./
RUN yarn

ARG APP
ENV APP=${APP}

FROM deps as builder

# Adding the rest of the code
ADD --chown=runner:runners . .
RUN yarn run build ${APP}

FROM deps as linter

# Adding the rest of the code
ADD --chown=runner:runners . .
RUN yarn run lint ${APP}

FROM deps as tests

# Adding the rest of the code
ADD --chown=runner:runners . .
RUN yarn run test ${APP}

FROM node:12.16.2-alpine3.11

ARG GIT_BRANCH
ARG GIT_SHA
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_SHA=${GIT_SHA}
ARG APP
ENV APP=${APP}

RUN apk add bash -U && rm -rf /var/cache/apk/*
WORKDIR /webapp

# Adding user for running the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /webapp
USER runner

COPY --from=builder --chown=runner:runners /build/dist/apps/${APP} /webapp/dist/apps/${APP}

ENTRYPOINT node /webapp/dist/apps/${APP}/main.js