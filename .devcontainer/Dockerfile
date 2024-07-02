
ARG NODE_IMAGE_TAG=lts-bookworm-slim
ARG REGISTRY=public.ecr.aws/docker
FROM ${REGISTRY}/library/node:${NODE_IMAGE_TAG} AS base-runtime

FROM ${REGISTRY}/library/node:20.14.0-alpine3.20 AS dependencies-alpine
RUN addgroup runners && adduser -D runner -G runners
# hadolint ignore=DL3018
RUN apk add --update --no-cache git python3 build-base gcc jq yq


FROM ${REGISTRY}/library/node:lts-bookworm-slim AS dependencies-debian
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN addgroup runners && yes '' | adduser --disabled-login runner && adduser runner runners
# hadolint ignore=DL3008
RUN \
  apt-get update && \
  apt-get install -y --no-install-recommends git python3 gcc python3 build-essential gcc jq yq && \
  apt-get clean autoclean && rm -rf /var/lib/apt/lists/*


FROM dependencies-alpine AS base-build
WORKDIR /workspaces/island.is

# hadolint ignore=DL3016
RUN --mount=type=cache,target=/root/.npm \
  npm install -g sequelize sequelize-cli pg

COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/native/app/package.json ./apps/native/app/
COPY .yarn/releases .yarn/releases
COPY .yarn/patches .yarn/patches
# hadolint ignore=DL3060
RUN --mount=type=cache,target=./.yarn/cache \
  CI=true yarn install --immutable




FROM base-build AS output-devcontainer
# hadolint ignore=DL3018
# RUN apk add --no-cache zsh bash
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends zsh bash

WORKDIR /workspaces/island.is
ENTRYPOINT [ "/bin/zsh" ]


FROM base-build AS prod
