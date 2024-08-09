ARG NODE_IMAGE_TAG
ARG DOCKER_REGISTRY=public.ecr.aws
FROM ${DOCKER_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} AS runner

RUN apk add postgresql-client bash


FROM ${DOCKER_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} AS build
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /app/infra


# System dependencies
RUN corepack enable

COPY infra/package.json infra/yarn.lock /app/infra/
COPY .yarn/ ./.yarn
RUN yarn install --immutable

COPY infra/ /app/infra/
COPY apps /app/apps/
COPY libs /app/libs/

RUN ./node_modules/.bin/ncc build src/feature-env.ts -o /app/dist/feature-env
RUN ./node_modules/.bin/ncc build src/secrets.ts -o /app/dist/secrets

FROM runner

COPY --from=build /app/dist/ /app
COPY infra/scripts/container-scripts/* ./app/
COPY infra/scripts/update-package-json.ts ./app/
WORKDIR /app

ENTRYPOINT [ "node", "feature-env" ]
