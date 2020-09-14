# This is a multi-stage Dockerfile which contains all CI-related operations as well as images to be deployed in production
FROM node:12.16.2-alpine3.11 as deps

RUN apk add -U git

WORKDIR /build

# Adding user for building the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /build
USER runner

# Adding and installing packages
ADD --chown=runner:runners package.json yarn.lock ./
RUN yarn install --frozen-lockfile && rm -rf /home/runner/.cache

FROM deps as src
# image with the source code
ADD --chown=runner:runners . .

FROM src as formatting

RUN yarn run format:check --all

FROM src as security-audit

RUN yarn run security-audit

FROM src as builder
ARG APP
ENV APP=${APP}

RUN yarn run build ${APP} --prod

FROM src as linter
ARG APP
ENV APP=${APP}

RUN yarn run lint ${APP}

FROM src as test

CMD yarn run test ${APP}

FROM src as nx-runner
# image use to run NX-related operations (print-affected, etc.)
ENV PATH=./node_modules/.bin:$PATH

FROM node:12.16.2-alpine3.11 as output-base
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

RUN apk add bash python py-pip jq curl -U \
    && rm -rf /var/cache/apk/*
RUN pip install awscli
WORKDIR /webapp

# Adding user for running the app
RUN addgroup runners && adduser -D runner -G runners
RUN chown -R runner:runners /webapp
USER runner

COPY --from=builder --chown=runner:runners /build/node_modules /webapp/node_modules

FROM output-base as output-express
# image with build of an Express.js app

COPY --from=builder --chown=runner:runners /build/${APP_DIST_HOME} /webapp

ENTRYPOINT [ "node" ]
CMD [ "main.js" ]

FROM output-base as output-next
# image with build of an Next.js app

COPY --from=builder --chown=runner:runners /build/${APP_HOME}/next.config.js /webapp
COPY --from=builder --chown=runner:runners /build/${APP_HOME}/next-modules/ /webapp/next-modules/
COPY --from=builder --chown=runner:runners /build/${APP_HOME}/public /webapp/public
COPY --from=builder --chown=runner:runners /build/${APP_DIST_HOME} /webapp/.next

ENTRYPOINT [ "npx", "next", "start", "-p", "4200" ]

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

ADD scripts/dockerfile-config/static-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html
