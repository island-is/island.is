# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
ARG PLAYWRIGHT_VERSION
ARG DOCKER_IMAGE_REGISTRY=public.ecr.aws
ARG NODE_IMAGE_TAG
ARG GIT_BRANCH
ARG GIT_SHA
FROM ${DOCKER_IMAGE_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} AS deps

# hadolint ignore=DL3018
RUN apk add -U git

WORKDIR /build

# Adding and installing packages
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/native/app/package.json ./apps/native/app/
COPY .yarn/ ./.yarn
# hadolint ignore=DL3018
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python
RUN CI=true yarn install --immutable

FROM deps AS src

RUN wget -O /tmp/jq-linux64 https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
  chmod a+x /tmp/jq-linux64 && \
  mv /tmp/jq-linux64 /usr/bin/jq

# image with the source code
COPY . .

FROM src AS builder
ARG APP
ARG APP_DIST_HOME
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN yarn run build ${APP} --prod

FROM ${DOCKER_IMAGE_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} AS output-base
# this is base image for containers that are to be deployed
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

FROM output-base AS output-base-with-pg

# hadolint ignore=DL3016
RUN npm install -g \
  sequelize \
  sequelize-cli \
  pg

USER runner

FROM output-base-with-pg AS output-express
ENV DD_GIT_COMMIT_SHA="${GIT_SHA}"
ENV DD_GIT_REPOSITORY_URL="github.com/island-is/island.is"

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENTRYPOINT []
CMD [ "node", "--no-experimental-fetch", "main.js" ]

FROM output-base-with-pg AS output-next
ENV DD_GIT_COMMIT_SHA="${GIT_SHA}"
ENV DD_GIT_REPOSITORY_URL="github.com/island-is/island.is"
ENV PORT=4200

# TODO: smallify
COPY --from=deps /build/node_modules /webapp/node_modules
COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENTRYPOINT [ "node", "main.js" ]

FROM $DOCKER_IMAGE_REGISTRY/nginx/nginx:1.21-alpine AS output-static
ARG APP
ARG APP_DIST_HOME
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_SHA=${GIT_SHA}
ENV APP=${APP}
ENV BASEPATH=/
ENV DD_GIT_COMMIT_SHA="${GIT_SHA}"
ENV DD_GIT_REPOSITORY_URL="github.com/island-is/island.is"

RUN mkdir -p /etc/nginx/templates
# hadolint ignore=DL3018
RUN apk update && \
  apk upgrade && \
  apk add bash nodejs

COPY scripts/dockerfile-assets/nginx/* /etc/nginx/templates
COPY scripts/dockerfile-assets/bash/extract-environment.sh /docker-entrypoint.d
COPY scripts/dockerfile-assets/bash/extract-environment.js /docker-entrypoint.d
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html

FROM output-base AS output-jest

RUN echo 'module.exports = {};' > jest.config.js

# hadolint ignore=DL3016
RUN npm install -g jest

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

USER runner

CMD [ "jest", "main.spec.js" ]



FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-focal AS playwright-base






FROM playwright-base AS output-playwright
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_SHA=${GIT_SHA}
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

ENV PLAYWRIGHT_BROWSER=chromium
RUN yarn playwright install ${PLAYWRIGHT_BROWSER}

COPY --chown=pwuser:pwuser --chmod=0755 ${APP_HOME}/entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]


FROM playwright-base AS output-local
ARG APP_HOME
ARG APP_DIST_HOME

WORKDIR ${APP_DIST_HOME}


# node user exists in the base image
RUN mkdir -p /out \
  && chown node:node /out

COPY --chown=pwuser:pwuser --chmod=0755 ${APP_HOME}/entrypoint.sh .

USER pwuser

ENTRYPOINT ["./entrypoint.sh"]

FROM output-base AS output-native
RUN echo "not-implemented"
