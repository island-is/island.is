FROM node:12.16.2-alpine3.11 as deps

RUN apk add -U git

WORKDIR /build

# Adding user for building the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /build
USER runner

# Adding and installing packages
ADD --chown=runner:runners package.json yarn.lock ./
RUN yarn && rm -rf /home/runner/.cache


FROM deps as src

ADD --chown=runner:runners . .

FROM src as formatting

RUN yarn run format:check --all

FROM src as builder
ARG APP
ENV APP=${APP}

RUN yarn run build ${APP}

FROM src as linter
ARG APP
ENV APP=${APP}

RUN yarn run lint ${APP}

FROM src as tests
ARG APP
ENV APP=${APP}

CMD yarn run test ${APP}

FROM src as nx-runner

ENV PATH=./node_modules/.bin:$PATH

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

COPY --from=builder --chown=runner:runners /build/dist/apps/${APP} /webapp
COPY --from=builder --chown=runner:runners /build/node_modules /webapp/node_modules

ENTRYPOINT [ "node" ]
CMD [ "main.js" ]

FROM node:12.16.2-alpine3.11 as output-next

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

COPY --from=builder --chown=runner:runners /build/node_modules /webapp/node_modules
COPY --from=builder --chown=runner:runners /build/apps/${APP}/next.config.js /webapp
COPY --from=builder --chown=runner:runners /build/apps/${APP}/public /webapp/public
COPY --from=builder --chown=runner:runners /build/dist/apps/${APP} /webapp/.next

ENTRYPOINT [ "npx", "next", "start", "-p", "4200" ]
