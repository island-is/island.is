# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
ARG PLAYWRIGHT_VERSION
ARG DOCKER_IMAGE_REGISTRY=public.ecr.aws
FROM $DOCKER_IMAGE_REGISTRY/docker/library/node:18-alpine3.15 as deps

RUN apk add -U git
RUN apk add --update --no-cache \
  python3 build-base gcc bash \
  && ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /build

# Adding and installing packages
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/native/app/package.json ./apps/native/app/
COPY .yarn/releases/ ./.yarn/releases/
COPY .yarn/patches/ ./.yarn/patches/
RUN ls -lah ./.yarn/ ./
RUN --mount=type=cache,target=./.yarn/cache --mount=type=cache,target=.cache --mount=type=cache,target=/root/.cache \
  CI=true yarn install --immutable


FROM deps as src

RUN wget -qO /tmp/jq-linux64 https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
  chmod a+x /tmp/jq-linux64 && \
  mv /tmp/jq-linux64 /usr/bin/jq

# image with the source code
# COPY *.* ./
COPY *.js *.json *.yaml *.yml *.ts *.lock ./
COPY .*.js .*.json .*.yaml .*.yml .*.ts .*.lock ./
COPY infra/ infra/
COPY libs/ libs/
COPY apps/ apps/

FROM src as builder
ARG APP
ARG APP_DIST_HOME=dist/apps/${APP}
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN id && pwd && ls -lah ./ .yarn ./apps/${APP}
RUN yarn run build ${APP} --prod

FROM $DOCKER_IMAGE_REGISTRY/docker/library/node:18-alpine3.15 as output-base
# this is base image for containers that are to be deployed
ARG GIT_BRANCH
ARG GIT_SHA
LABEL branch=${GIT_BRANCH}
LABEL commit=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_SHA=${GIT_SHA}
ARG APP
ARG APP_HOME
ARG APP_DIST_HOME=dist/apps/${APP}
ENV APP=${APP}
ENV NODE_ENV=production

WORKDIR /webapp

# Adding user for running the app
RUN addgroup runners && adduser -D runner -G runners

FROM output-base as output-base-with-pg

RUN npm install -g \
  sequelize \
  sequelize-cli \
  pg

USER runner

FROM output-base-with-pg as output-express

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENTRYPOINT []
CMD [ "node", "--no-experimental-fetch", "main.js" ]

FROM output-base-with-pg as output-next

ENV PORT=4200

# TODO: smallify
COPY --from=deps /build/node_modules /webapp/node_modules
COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENTRYPOINT [ "node", "--no-experimental-fetch", "main.js" ]

FROM $DOCKER_IMAGE_REGISTRY/nginx/nginx:1.21-alpine as output-static

ARG APP
ARG APP_DIST_HOME=dist/apps/${APP}
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

COPY scripts/dockerfile-assets/nginx/* /etc/nginx/templates
COPY scripts/dockerfile-assets/bash/extract-environment.sh /docker-entrypoint.d
COPY scripts/dockerfile-assets/bash/extract-environment.js /docker-entrypoint.d
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html

FROM output-base as output-jest

RUN echo 'module.exports = {};' > jest.config.js

RUN npm install -g jest

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

USER runner

CMD [ "jest", "main.spec.js" ]



FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-focal as playwright-base






FROM playwright-base as output-playwright
# TODO: remove awscli dependency (157 MB extra)
RUN apt-get update -y && apt-get install -y zip awscli make g++ && apt-get purge

ARG APP_HOME=apps/system-e2e
ARG APP_DIST_HOME=dist/apps/${APP}

WORKDIR /data

# Common slow-changing dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
COPY .yarn/patches ./.yarn/patches

ARG PLAYWRIGHT_BROWSER=chromium
RUN --mount=type=cache,id=playwright-cache,target=./.yarn/cache --mount=type=cache,id=playwright-node_modules,target=./node_modules \
  export CI=true && yarn add playwright && yarn playwright install ${PLAYWRIGHT_BROWSER}

# Built app
COPY --from=builder /build/${APP_DIST_HOME} ${APP_HOME}
COPY ${APP_HOME}/entrypoint.sh ${APP_HOME}


RUN chown -R pwuser:pwuser .
USER pwuser
RUN --mount=type=cache,id=playwright-cache,target=./.yarn/cache --mount=type=cache,id=playwright-node_modules,target=./node_modules \
  yarn install
ENV PATH="${APP_HOME}:${PATH}"
ENTRYPOINT ["entrypoint.sh"]


FROM playwright-base as output-local
ARG APP_HOME


# node user exists in the base image
RUN mkdir -p /out \
  && chown node:node /out

COPY --chown=pwuser:pwuser ${APP_HOME}/entrypoint.sh .

USER pwuser

ENTRYPOINT ["./entrypoint.sh"]

FROM output-base as output-native
RUN echo "not-implemented"
