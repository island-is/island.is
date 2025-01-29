# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production

# Global ARGs (used across multiple stages)
ARG PLAYWRIGHT_VERSION
ARG DOCKER_ECR_REGISTRY=public.ecr.aws/docker
ARG DOCKER_IMAGE_REGISTRY=${DOCKER_ECR_REGISTRY%/docker}
# Alias DOCKER_IMAGE_REGISTRY to DOCKER_REGISTRY for backwards compatibility
ARG DOCKER_REGISTRY=${DOCKER_IMAGE_REGISTRY}/docker
ARG NODE_IMAGE_VERSION=20
ARG APP_HOME
ARG APP_DIST_HOME=dist/${APP_HOME}
ARG APP

# Base image for dependencies
FROM node:${NODE_IMAGE_VERSION}-bookworm-slim AS deps

# Install git
RUN apt-get update && apt-get install -y git && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Adding and installing packages
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/native/app/package.json ./apps/native/app/
COPY .yarn/ ./.yarn

RUN apt-get update && apt-get install -y python3 build-essential gcc && \
  ln -sf /usr/bin/python3 /usr/bin/python && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

RUN CI=true yarn install --immutable

# Image with source code
FROM deps AS src

RUN apt-get update && apt-get install -y wget && \
  wget -O /usr/local/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
  chmod +x /usr/local/bin/jq && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# image with the source code
COPY . .

# Build stage
FROM src AS builder

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN yarn run build ${APP} --prod

# This is base image for containers that are to be deployed
FROM node:${NODE_IMAGE_VERSION}-bookworm-slim AS output-base
ARG APP
ARG APP_HOME
ARG APP_DIST_HOME
ENV APP=${APP}
ENV NODE_ENV=production

WORKDIR /webapp

# Adding user for running the app
RUN groupadd runners && useradd -m -g runners runner

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
ENTRYPOINT []
CMD [ "node", "--no-experimental-fetch", "main.js" ]

FROM output-base-with-pg AS output-next

# Stage-specific ARGs
ARG APP
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
ENTRYPOINT [ "node", "main.js" ]

FROM ${DOCKER_REGISTRY}/library/nginx:1.21-alpine AS output-static

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

RUN mkdir -p /etc/nginx/templates
# hadolint ignore=DL3018
RUN apk update && \
  apk upgrade && \
  apk add bash nodejs

COPY scripts/dockerfile-assets/nginx/* /etc/nginx/templates
COPY scripts/dockerfile-assets/bash/extract-environment.sh /docker-entrypoint.d
COPY scripts/dockerfile-assets/bash/extract-environment.js /docker-entrypoint.d
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}

ENV APP=${APP}
ENV BASEPATH=/

FROM output-base AS output-jest

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

RUN echo 'module.exports = {};' > jest.config.js

# hadolint ignore=DL3016
RUN npm install -g jest

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
ARG APP
ARG APP_DIST_HOME
ARG APP_HOME
ARG PLAYWRIGHT_BROWSER=chromium
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

# TODO: remove awscli dependency (157 MB extra)

# hadolint ignore=DL3008
RUN apt-get update -y && apt-get install -y zip awscli && apt-get purge

ARG APP_HOME
ARG APP_DIST_HOME

WORKDIR ${APP_DIST_HOME}

COPY --from=builder /build/${APP_DIST_HOME} .
COPY ${APP_HOME}/package.json .
RUN chown -R pwuser:pwuser .

USER pwuser
COPY .yarnrc.yml ./
RUN mkdir ./.yarn
COPY .yarn/releases ./.yarn/releases
RUN yarn install

RUN yarn playwright install ${PLAYWRIGHT_BROWSER}

COPY --chown=pwuser:pwuser --chmod=0755 ${APP_HOME}/entrypoint.sh .

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}
ENTRYPOINT ["./entrypoint.sh"]

FROM output-base AS output-native

RUN echo "not-implemented"
