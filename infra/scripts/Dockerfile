ARG DOCKER_IMAGE_REGISTRY=public.ecr.aws
ARG NODE_IMAGE_TAG
FROM ${DOCKER_IMAGE_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} as runner

RUN apk add postgresql-client bash

FROM ${DOCKER_IMAGE_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} as build

ENV NODE_OPTIONS=--openssl-legacy-provider

ADD infra/package.json infra/yarn.lock /app/infra/
COPY .yarn/ ./.yarn
WORKDIR /app/infra
RUN yarn install --immutable

ADD infra/ /app/infra/
ADD apps /app/apps/
ADD libs /app/libs/

RUN ./node_modules/.bin/ncc build src/feature-env.ts -o /app/dist/feature-env
RUN ./node_modules/.bin/ncc build src/secrets.ts -o /app/dist/secrets

FROM runner

COPY --from=build /app/dist/ /app
COPY infra/scripts/container-scripts/* ./app/
COPY infra/scripts/update-package-json.ts ./app/
WORKDIR /app

ENTRYPOINT [ "node", "feature-env" ]
