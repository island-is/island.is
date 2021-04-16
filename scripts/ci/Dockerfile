# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
FROM node:14.16.0-alpine3.11 as deps

RUN apk add -U git

WORKDIR /build

# Adding and installing packages
ADD package.json yarn.lock ./

RUN mkdir -p /build/scripts
ADD ./scripts/postinstall.js /build/scripts/
RUN CI=true yarn install --frozen-lockfile && rm -rf /root/.cache

FROM deps as src
# image with the source code
ADD . .

FROM src as builder
ARG APP
ENV APP=${APP}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN yarn run build ${APP} --prod

FROM node:14.16.0-alpine3.11 as output-base
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

COPY --from=deps /build/node_modules /webapp/node_modules

# Adding user for running the app
RUN addgroup runners && adduser -D runner -G runners
USER runner

FROM output-base as output-express
# image with build of an Express.js app

COPY --from=builder /build/${APP_DIST_HOME} /webapp

ENTRYPOINT [ "node" ]
CMD [ "main.js" ]

FROM output-base as output-next
# image with build of an Next.js app

ENV PORT=4200

COPY --from=builder /build/${APP_DIST_HOME} /webapp

ENTRYPOINT [ "node", "main.js" ]

FROM nginx:1.19.2-alpine as output-static

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
RUN apk add bash && \
  curl -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o /tmp/jq-linux64 && \
  chmod a+x /tmp/jq-linux64 && \
  mv /tmp/jq-linux64 /usr/bin/jq
ADD scripts/ci/dockerfile-assets/nginx/* /etc/nginx/templates
ADD scripts/ci/dockerfile-assets/bash/extract-environment.sh /docker-entrypoint.d
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html
