# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
ARG PLAYWRIGHT_VERSION
ARG DOCKER_IMAGE_REGISTRY=public.ecr.aws
FROM $DOCKER_IMAGE_REGISTRY/docker/library/node:18-alpine3.15 as base-image
FROM $DOCKER_IMAGE_REGISTRY/nginx/nginx:1.21-alpine as base-image
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-focal as playwright-image

FROM base-image as deps

RUN apk add -U git

WORKDIR /build

# Adding and installing packages
ADD package.json yarn.lock .yarnrc.yml ./
ADD apps/native/app/package.json ./apps/native/app/
COPY .yarn/ ./.yarn
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python
RUN CI=true yarn install --immutable

FROM deps as src

RUN wget -O /tmp/jq-linux64 https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
  chmod a+x /tmp/jq-linux64 && \
  mv /tmp/jq-linux64 /usr/bin/jq

# image with the source code
ADD . .

FROM src as builder
ARG APP
ARG APP_DIST_HOME
ARG GEOIP_LICENSE_KEY
ENV APP=${APP}
ENV GEOIP_LICENSE_KEY=${GEOIP_LICENSE_KEY}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN yarn run build ${APP} --prod

FROM base-image as output-base
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

FROM nginx-image as output-static

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

FROM output-base as output-jest

RUN echo 'module.exports = {};' > jest.config.js

RUN npm install -g jest

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

USER runner

CMD [ "jest", "main.spec.js" ]









FROM playwright-image as output-playwright
# TODO: remove awscli dependency (157 MB extra)
RUN apt-get update && apt-get install -y zip awscli && apt-get purge

ARG APP_HOME
ARG APP_DIST_HOME

WORKDIR ${APP_DIST_HOME}

COPY --from=builder /build/${APP_DIST_HOME} .
COPY ${APP_HOME}/package.json .
RUN chown -R pwuser:pwuser .

USER pwuser
RUN yarn set version berry
RUN yarn install

ENV PLAYWRIGHT_BROWSER=chromium
RUN yarn playwright install ${PLAYWRIGHT_BROWSER}

COPY --chown=pwuser:pwuser ${APP_HOME}/entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]




FROM base-image as localrun
WORKDIR /data

RUN wget -O /tmp/jq-linux64 https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
  chmod a+x /tmp/jq-linux64 && \
  mv /tmp/jq-linux64 /usr/bin/jq

RUN apk add --update --no-cache git bash nodejs python3 build-base gcc openjdk11 && ln -sf /usr/bin/python3 /usr/bin/python
RUN ["yarn", "set", "version", "berry"]
# ENV YARN_CACHE_FOLDER=/cache/yarn
# RUN mkdir -p $YARN_CACHE_FOLDER

# COPY package.json /data/
RUN ["yarn", "add", "playwright"]
RUN ["yarn", "playwright", "install"]

VOLUME /cache
VOLUME /data
COPY . /data/

CMD [ "yarn", "install" ]



FROM output-base as output-native
RUN echo "not-implemented"
