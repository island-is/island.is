# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
# `base-*` layers are intended for maximum cacheability, only doing system-level actions

# Global ARGs (used across multiple stages)
ARG PLAYWRIGHT_VERSION=1.49.1
ARG PLAYWRIGHT_IMAGE_TAG=v${PLAYWRIGHT_VERSION}-focal
ARG DOCKER_ECR_REGISTRY=public.ecr.aws/docker
ARG DOCKER_IMAGE_REGISTRY=${DOCKER_ECR_REGISTRY%/docker}
# Alias DOCKER_IMAGE_REGISTRY to DOCKER_REGISTRY for backwards compatibility
ARG DOCKER_REGISTRY=${DOCKER_IMAGE_REGISTRY}/docker
ARG NODE_IMAGE_TAG=20-alpine
ARG APP_HOME
ARG APP_DIST_HOME=dist/${APP_HOME}
ARG APP


# Base image for dependencies
FROM ${DOCKER_REGISTRY}/library/node:${NODE_IMAGE_TAG} AS base-deps

# hadolint ignore=DL3018
RUN apk add --no-cache python3 build-base gcc git jq openjdk21 py3-distutils-extra && \
  rm -rf /var/cache/apk/* && \
  ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /build


# Add intermediate step for debugging system dependencies
FROM base-deps AS deps

# Adding and installing packages
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/native/app/package.json ./apps/native/app/
COPY .yarn/ ./.yarn

# hadolint ignore=DL3060
RUN --mount=type=cache,target=.yarn/cache \
  # Cache-mount the relatively frequently changing caches
  CI=true yarn install --immutable


# Image with source code
FROM deps AS src

# image with the source code
COPY . ./


# Build stage
FROM src AS builder

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN yarn run build ${APP} --prod

SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN mv "dist/$(yarn nx show project ${APP} --json | jq -r '.root')" /dist


# This is base image for containers that are to be deployed
FROM ${DOCKER_REGISTRY}/library/node:${NODE_IMAGE_TAG} AS base-node

ARG APP
ARG APP_HOME
ARG APP_DIST_HOME
ENV APP=${APP}
ENV NODE_ENV=production

# Adding user for running the app
RUN addgroup runners && \
  adduser --disabled-password runner --ingroup runners


FROM base-node AS base-node-with-pg

# hadolint ignore=DL3016
RUN npm install -g \
  sequelize \
  sequelize-cli \
  pg

USER runner


# Add alias for compatability
FROM base-node AS output-base


FROM base-node-with-pg AS output-express
WORKDIR /webapp

# Stage-specific ARGs
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

COPY --from=builder /dist ./
RUN ls -lah .

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}
ENTRYPOINT [ "node", "--no-experimental-fetch", "main.js" ]


FROM base-node-with-pg AS output-next
WORKDIR /webapp

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

ENV PORT=4200

# TODO: smallify
COPY --from=deps /build/node_modules ./
COPY --from=builder /dist ./
RUN ls -lah .

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}
ENTRYPOINT [ "node", "main.js" ]


FROM ${DOCKER_REGISTRY}/library/nginx:1.21-alpine AS base-static

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

RUN mkdir -p /etc/nginx/templates
# hadolint ignore=DL3018
RUN apk add --no-cache bash nodejs && \
  rm -rf /var/cache/apk/*


FROM base-static AS output-static
WORKDIR /usr/share/nginx/html

COPY scripts/dockerfile-assets/nginx/* /etc/nginx/templates
COPY scripts/dockerfile-assets/bash/extract-environment.sh /docker-entrypoint.d
COPY scripts/dockerfile-assets/bash/extract-environment.js /docker-entrypoint.d
COPY --from=builder /dist ./
RUN ls -lah .

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}

ENV APP=${APP}
ENV BASEPATH=/


FROM base-node AS base-jest

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

# hadolint ignore=DL3016
RUN npm install -g jest
# hadolint ignore=DL3059
RUN echo 'module.exports = {};' > jest.config.js


FROM base-jest AS output-jest
WORKDIR /webapp

COPY --from=builder /dist ./
RUN ls -lah .

USER runner

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}
CMD [ "jest", "main.spec.js" ]


FROM mcr.microsoft.com/playwright:${PLAYWRIGHT_IMAGE_TAG} AS playwright-base

# TODO: remove awscli dependency (157 MB extra)
# hadolint ignore=DL3008
RUN apt-get update -y && \
  apt-get install -y --no-install-recommends zip awscli && \
  apt-get purge && \
  rm -rf /var/lib/apt/lists/*


FROM playwright-base AS output-playwright
WORKDIR /testing

# Stage-specific ARGs
ARG APP
ARG APP_DIST_HOME
ARG APP_HOME
ARG PLAYWRIGHT_BROWSER=chromium
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

COPY .yarnrc.yml ${APP_HOME}/package.json ./
COPY .yarn/releases ./.yarn/releases

RUN yarn install && \
  yarn playwright install ${PLAYWRIGHT_BROWSER} && \
  yarn cache clean

COPY --from=builder /dist ./
COPY --chmod=0755 ${APP_HOME}/entrypoint.sh ./

ENV GIT_BRANCH=${GIT_BRANCH} GIT_COMMIT_SHA=${GIT_COMMIT_SHA} GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
ENV DD_GIT_BRANCH=${GIT_BRANCH} DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_COMMIT_SHA}
USER pwuser
ENTRYPOINT [ "./entrypoint.sh" ]


FROM base-node AS output-native
WORKDIR /native

RUN echo "not-implemented"
