ARG DOCKER_IMAGE_REGISTRY=public.ecr.aws
ARG NODE_IMAGE_VERSION
ARG NODE_IMAGE_TAG=${NODE_IMAGE_VERSION}-alpine3.20
FROM ${DOCKER_IMAGE_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} AS runner

# hadolint ignore=DL3018
RUN apk add --no-cache postgresql-client bash

FROM ${DOCKER_IMAGE_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} AS build
WORKDIR /app/infra

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY infra/package.json infra/yarn.lock /app/infra/
COPY .yarn/ ./.yarn
RUN yarn install --immutable

COPY infra/ /app/infra/
COPY apps /app/apps/
COPY libs /app/libs/

RUN ./node_modules/.bin/ncc build src/feature-env.ts -o /app/dist/feature-env && \
  ./node_modules/.bin/ncc build src/secrets.ts -o /app/dist/secrets

FROM runner
WORKDIR /app

COPY --from=build /app/dist/ /app
COPY infra/scripts/container-scripts/* /app/
COPY infra/scripts/update-package-json.ts /app/

ENTRYPOINT [ "node", "feature-env" ]
