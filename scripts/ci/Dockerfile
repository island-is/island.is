# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
ARG DOCKER_IMAGE_REGISTRY=public.ecr.aws
FROM $DOCKER_IMAGE_REGISTRY/docker/library/node:14.19.0-alpine3.14 as deps

RUN apk add -U git

WORKDIR /build

# Adding and installing packages
ADD package.json yarn.lock ./

RUN CI=true yarn install --frozen-lockfile

FROM deps as src
# image with the source code
ADD . .

FROM src as builder
ARG APP
ARG APP_DIST_HOME
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN yarn run build ${APP} --prod

FROM $DOCKER_IMAGE_REGISTRY/docker/library/node:14.19.0-alpine3.14 as output-base
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
CMD [ "node", "main.js" ]

FROM output-base-with-pg as output-next

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
