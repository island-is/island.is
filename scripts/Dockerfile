FROM node:12.16.2-alpine3.11 as deps
WORKDIR /build

# Adding user for building the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /build
USER runner

# Adding and installing packages
ADD --chown=runner:runners package.json yarn.lock ./
RUN yarn && rm -rf /home/runner/.cache

ARG APP
ENV APP=${APP}

FROM deps as src

ADD --chown=runner:runners . .

FROM src as formatting

RUN yarn run format:check --all

FROM src as builder

RUN yarn run build ${APP}

FROM src as linter

RUN yarn run lint ${APP}

FROM src as tests

CMD yarn run test ${APP}

FROM node:12.16.2-alpine3.11 as output-express

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