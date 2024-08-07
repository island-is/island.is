# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
ARG PLAYWRIGHT_VERSION
ARG DOCKER_IMAGE_REGISTRY=public.ecr.aws
ARG NODE_IMAGE_TAG
FROM ${DOCKER_IMAGE_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} as deps

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
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN yarn run build ${APP} --prod

FROM ${DOCKER_IMAGE_REGISTRY}/docker/library/node:${NODE_IMAGE_TAG} as output-base
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
ARG GIT_SHA
ENV DD_GIT_COMMIT_SHA="${GIT_SHA}"
ENV DD_GIT_REPOSITORY_URL="github.com/island-is/island.is"

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENTRYPOINT []
CMD [ "node", "--no-experimental-fetch", "main.js" ]

FROM output-base-with-pg as output-next
ARG GIT_SHA
ENV DD_GIT_COMMIT_SHA="${GIT_SHA}"
ENV DD_GIT_REPOSITORY_URL="github.com/island-is/island.is"
ENV PORT=4200

# TODO: smallify
COPY --from=deps /build/node_modules /webapp/node_modules
COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENTRYPOINT [ "node", "main.js" ]

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
ENV DD_GIT_COMMIT_SHA="${GIT_SHA}"
ENV DD_GIT_REPOSITORY_URL="github.com/island-is/island.is"

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



FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-focal as playwright-base






FROM playwright-base as output-playwright
# TODO: remove awscli dependency (157 MB extra)
RUN apt-get update -y && apt-get install -y zip awscli && apt-get purge

ARG APP_HOME
ARG APP_DIST_HOME

WORKDIR ${APP_DIST_HOME}

COPY --from=builder /build/${APP_DIST_HOME} .
COPY ${APP_HOME}/package.json .
RUN chown -R pwuser:pwuser .

USER pwuser
ADD .yarnrc.yml ./
RUN mkdir ./.yarn
COPY .yarn/releases ./.yarn/releases
RUN yarn install

ENV PLAYWRIGHT_BROWSER=chromium
RUN yarn playwright install ${PLAYWRIGHT_BROWSER}

COPY --chown=pwuser:pwuser ${APP_HOME}/entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]


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
