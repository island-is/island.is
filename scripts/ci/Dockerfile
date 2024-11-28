# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production

# Global ARGs (used across multiple stages)
ARG PLAYWRIGHT_VERSION
ARG DOCKER_ECR_REGISTRY=public.ecr.aws/docker
ARG NODE_IMAGE_TAG=latest
ARG DOCKER_REGISTRY=${DOCKER_ECR_REGISTRY%/docker}/docker
ARG APP_HOME
ARG APP_DIST_HOME=dist/${APP_HOME}
ARG APP

# Base image for dependencies
FROM ${DOCKER_REGISTRY}/library/node:${NODE_IMAGE_TAG} AS deps

# We don't want to pin specific versions; it's verbose and will become outdated quickly
# BusyBox version of `wget` doesn't have a --progress option
# hadolint ignore=DL3047,DL3018
RUN apk --update --no-cache add git python3 build-base gcc && \
  ln -sf /usr/bin/python3 /usr/bin/python && \
  wget -O /tmp/jq-linux64 https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
  chmod a+x /tmp/jq-linux64 && \
  mv /tmp/jq-linux64 /usr/bin/jq

WORKDIR /build

# Adding and installing packages
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/native/app/package.json ./apps/native/app/
COPY .yarn/ ./.yarn
# hadolint ignore=DL3018
RUN CI=true yarn install --immutable && \
  yarn cache clean
RUN echo "PWD: $PWD" && \
  ls -lah && \
  ls -lah -d node_modules/

# Image with source code
FROM deps AS src

# # image with the source code
COPY .npmrc .yarnrc.yml ./
COPY *.* ./
COPY .yarn/releases .yarn/patches .yarn/
COPY apps apps/
COPY charts charts/
COPY infra infra/
COPY libs libs/
COPY scripts scripts/
COPY tools tools/

RUN echo "PWD: $PWD" && \
  ls -lah

# Build stage
FROM src AS builder

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV APP=${APP}

RUN yarn run build ${APP} --prod
RUN cp yarn.lock .yarnrc.yml "${APP_DIST_HOME}" && \
  mkdir -p "${APP_DIST_HOME}/.yarn" && \
  cp -r .yarn/patches .yarn/releases "${APP_DIST_HOME}/.yarn/"
RUN echo "PWD: $PWD" && \
  ls -lah ./ && \
  ls -lah ${APP_DIST_HOME} && \
  cat "${APP_DIST_HOME}/package.json"


WORKDIR ${APP_DIST_HOME}
RUN yarn install && \
  yarn cache clean
RUN ls -lah ./ && \
  du -hd 1 ./


# Base image for runtime containers
FROM ${DOCKER_REGISTRY}/library/node:${NODE_IMAGE_TAG} AS output-base

ENV NODE_ENV=production
WORKDIR /webapp

# Adding user for running the app
RUN addgroup runners && \
  adduser -D runner -G runners

FROM output-base AS output-base-with-pg

# hadolint ignore=DL3016
RUN npm install -g \
  sequelize \
  sequelize-cli \
  pg

USER runner

FROM output-base-with-pg AS output-express

# Stage-specific ARGs
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}

RUN echo "PWD: $PWD" && \
  ls -lah ./ && \
  ls -lah main.js

ENTRYPOINT [ "node", "--no-experimental-fetch", "main.js" ]

FROM output-base-with-pg AS output-next

# Stage-specific ARGs
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

ENV PORT=4200

# TODO: smallify
COPY --from=deps /build/node_modules /webapp/node_modules
COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}

RUN echo "PWD: $PWD" && \
  ls -lah ./ && \
  ls -lah main.js

ENTRYPOINT [ "node", "main.js" ]

FROM ${DOCKER_REGISTRY}/nginx/nginx:1.21-alpine AS output-static

# Stage-specific ARGs
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

# hadolint ignore=DL3018
RUN apk add --no-cache bash nodejs

COPY scripts/dockerfile-assets/nginx/* /etc/nginx/templates/
COPY scripts/dockerfile-assets/bash/extract-environment.sh /docker-entrypoint.d/
COPY scripts/dockerfile-assets/bash/extract-environment.js /docker-entrypoint.d/
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}

ENV APP=${APP}
ENV BASEPATH=/

FROM output-base AS output-jest

# Stage-specific ARGs
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

# hadolint ignore=DL3016
RUN npm install -g jest && \
  echo 'module.exports = {};' > jest.config.js

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

USER runner

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}

CMD [ "jest", "main.spec.js" ]

FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-focal AS playwright-base

FROM playwright-base AS output-playwright

# Stage-specific ARGs
ARG APP_DIST_HOME
ARG APP_HOME
ARG PLAYWRIGHT_BROWSER=chromium
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

# TODO: remove awscli dependency (157 MB extra)
# hadolint ignore=DL3008
RUN apt-get update -y && \
  apt-get install --no-install-recommends -y zip awscli && \
  apt-get purge

WORKDIR /${APP_DIST_HOME}

COPY --chown=pwuser:pwuser --from=builder /build/${APP_DIST_HOME} ./
COPY --chown=pwuser:pwuser ${APP_HOME}/package.json ./

USER pwuser
COPY --chown=pwuser:pwuser .yarnrc.yml ./
RUN mkdir ./.yarn
COPY --chown=pwuser:pwuser .yarn/releases ./.yarn/releases
RUN CI=true yarn install --immutable && \
  yarn cache clean

ENV PLAYWRIGHT_BROWSER=${PLAYWRIGHT_BROWSER}
RUN yarn playwright install ${PLAYWRIGHT_BROWSER}

COPY --chown=pwuser:pwuser --chmod=0755 ${APP_HOME}/entrypoint.sh .

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}

RUN echo "PWD: $PWD" && \
  ls -lah ./ && \
  ls -lah ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

FROM playwright-base AS output-local

# Stage-specific ARGs
ARG APP_DIST_HOME
ARG APP_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

WORKDIR ${APP_DIST_HOME}

# node user exists in the base image
RUN mkdir -p /out && \
  chown node:node /out

COPY --chown=pwuser:pwuser --chmod=0755 ${APP_HOME}/entrypoint.sh .

USER pwuser

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}

RUN echo "PWD: $PWD" && \
  ls -lah ./ && \
  ls -lah ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

FROM output-base AS output-native

RUN echo "not-implemented"
