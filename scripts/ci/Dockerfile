# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
ARG CONTAINER_IMAGE_REGISTRY=public.ecr.aws
ARG CONTAINER_PLAYWRIGHT_VERSION=v1.31-focal
ARG CONTAINER_PLAYWRIGHT_BROWSER=chromium
ARG CONTAINER_NODE_VERSION=18-alpine3.15
ARG CONTAINER_NGINX_VERSION=1.21-alpine
ARG CONTAINER_JQ_VERSION=1.6
ARG CONTAINER_FEDORA_VERSION=39
ARG CONTAINER_UBUNTU_VERSION=22.04

# Base layers
ARG CONTAINER_IMAGE_REGISTRY
FROM ${CONTAINER_IMAGE_REGISTRY}/docker/library/fedora:${CONTAINER_FEDORA_VERSION} as base-fedora
ARG CONTAINER_IMAGE_REGISTRY
FROM ${CONTAINER_IMAGE_REGISTRY}/docker/library/ubuntu:${CONTAINER_UBUNTU_VERSION} as base-ubuntu
ARG CONTAINER_IMAGE_REGISTRY
FROM ${CONTAINER_IMAGE_REGISTRY}/docker/library/node:${CONTAINER_NODE_VERSION} as base-node
ARG CONTAINER_IMAGE_REGISTRY
FROM ${CONTAINER_IMAGE_REGISTRY}/nginx/nginx:${CONTAINER_NGINX_VERSION} as base-nginx
ARG CONTAINER_PLAYWRIGHT_VERSION
FROM mcr.microsoft.com/playwright:${CONTAINER_PLAYWRIGHT_VERSION} as base-playwright

# Layer aliases
FROM base-ubuntu as base-localdev
# FROM base-node as base-localdev
# FROM base-fedora as base-localdev


FROM base-node as deps

RUN apk add -U git

WORKDIR /build

# Adding and installing packages
ADD package.json yarn.lock .yarnrc.yml ./
ADD apps/native/app/package.json ./apps/native/app/
COPY .yarn/ ./.yarn
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python
RUN CI=true yarn install --immutable

FROM deps as src

ARG CONTAINER_JQ_VERSION
RUN wget -O /tmp/jq-linux64 https://github.com/stedolan/jq/releases/download/jq-${CONTAINER_JQ_VERSION}/jq-linux64 && \
  chmod a+x /tmp/jq-linux64 && \
  mv /tmp/jq-linux64 /usr/bin/jq

# image with the source code
ADD . .

FROM src as builder
ARG APP
ARG APP_DIST_HOME
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN yarn run build ${APP} --prod

FROM base-node as base-output
# this is base image for containers that are to be deployed
ARG GIT_BRANCH
ARG GIT_SHA
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_SHA=${GIT_SHA}
ARG APP
ARG APP_HOME
ARG APP_DIST_HOME
ENV APP=${APP}
ENV NODE_ENV=production

WORKDIR /webapp

# Adding user for running the app
RUN addgroup runners && adduser -D runner -G runners

FROM base-output as base-output-with-pg

RUN npm install -g \
  sequelize \
  sequelize-cli \
  pg

USER runner

FROM base-output-with-pg as output-express

ARG APP_DIST_HOME
COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENTRYPOINT []
CMD [ "node", "--no-experimental-fetch", "main.js" ]

FROM base-output-with-pg as output-next

ENV PORT=4200

# TODO: smallify
COPY --from=deps /build/node_modules /webapp/node_modules
ARG APP_DIST_HOME
COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENTRYPOINT [ "node", "--no-experimental-fetch", "main.js" ]

FROM base-nginx as output-static

ARG APP
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_SHA
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_SHA=${GIT_SHA}
ENV APP=${APP}
ENV BASEPATH=/

RUN mkdir -p /etc/nginx/templates
RUN apk update && \
  apk upgrade && \
  apk add bash nodejs

ADD scripts/dockerfile-assets/nginx/* /etc/nginx/templates
ADD scripts/dockerfile-assets/bash/extract-environment.sh /docker-entrypoint.d
ADD scripts/dockerfile-assets/bash/extract-environment.js /docker-entrypoint.d
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html

FROM base-output as output-jest

RUN echo 'module.exports = {};' > jest.config.js

RUN npm install -g jest

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

USER runner

CMD [ "jest", "main.spec.js" ]





FROM base-playwright as output-playwright
# TODO: remove awscli dependency (157 MB extra)
RUN apt-get update -y && apt-get install -y zip awscli && apt-get purge

ARG APP_HOME
ARG APP_DIST_HOME

WORKDIR ${APP_DIST_HOME}

COPY --from=builder /build/${APP_DIST_HOME} .
COPY ${APP_HOME}/package.json .
RUN chown -R pwuser:pwuser .

USER pwuser
ADD .yarnrc.yml ./
RUN mkdir ./.yarn
COPY .yarn/releases ./.yarn/releases
RUN yarn install

ARG CONTAINER_PLAYWRIGHT_BROWSER
RUN yarn playwright install ${CONTAINER_PLAYWRIGHT_BROWSER}

COPY --chown=pwuser:pwuser ${APP_HOME}/entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]


FROM base-playwright as output-local
ARG APP_HOME


# node user exists in the base image
RUN mkdir -p /out \
  && chown node:node /out

COPY --chown=pwuser:pwuser ${APP_HOME}/entrypoint.sh .

USER pwuser

ENTRYPOINT ["./entrypoint.sh"]

FROM base-output as output-native
RUN echo "not-implemented"


FROM base-localdev as output-localdev
