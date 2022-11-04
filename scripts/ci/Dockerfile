# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
ARG DOCKER_IMAGE_REGISTRY=public.ecr.aws
FROM $DOCKER_IMAGE_REGISTRY/docker/library/node:18-alpine3.15 as deps

RUN apk add -U git

WORKDIR /build

# Adding and installing packages
ADD package.json yarn.lock .yarnrc.yml ./
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
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

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

FROM $DOCKER_IMAGE_REGISTRY/nginx/nginx:1.21-alpine as output-static

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
  apk add bash && \
  curl -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o /tmp/jq-linux64 && \
  chmod a+x /tmp/jq-linux64 && \
  mv /tmp/jq-linux64 /usr/bin/jq
ADD scripts/dockerfile-assets/nginx/* /etc/nginx/templates
ADD scripts/dockerfile-assets/bash/extract-environment.sh /docker-entrypoint.d
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html

FROM output-base as output-jest

RUN echo 'module.exports = {};' > jest.config.js

RUN npm install -g jest

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

USER runner

CMD [ "jest", "main.spec.js" ]

FROM mcr.microsoft.com/playwright:v1.25.2-focal as playwright-base



FROM playwright-base as output-playwright

ARG APP_HOME
ARG APP_DIST_HOME

WORKDIR ${APP_DIST_HOME}
ENV APP_DIST_HOME=${APP_DIST_HOME}

RUN mkdir -p /${APP_DIST_HOME} \
  && chown pwuser:pwuser /${APP_DIST_HOME}

RUN chown -R pwuser:pwuser /tmp
RUN apt-get update && apt-get install -y vim
RUN apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev
RUN apt-get -y install awscli zip

COPY --chown=pwuser:pwuser ${APP_HOME}/package.json .
RUN yarn install
COPY --chown=pwuser:pwuser --from=builder /build/${APP_DIST_HOME} /${APP_DIST_HOME}/
COPY --chown=pwuser:pwuser ${APP_HOME}/entrypoint.sh .
USER pwuser
ENTRYPOINT ["./entrypoint.sh"]

FROM playwright-base as output-local
ARG APP_HOME


# node user exists in the base image
RUN mkdir -p /out \
  && chown pwuser:pwuser /out

COPY --chown=pwuser:pwuser ${APP_HOME}/entrypoint.sh .

USER pwuser

ENTRYPOINT ["./entrypoint.sh"]
