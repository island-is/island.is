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

FROM cypress/base:14.17.6 as cypress-base

USER root
RUN id

RUN node --version

# Chrome dependencies
RUN apt-get update && \
  apt-get install -y \
  fonts-liberation \
  libcurl4 \
  libcurl3-gnutls \
  libcurl3-nss \
  xdg-utils \
  wget \
  curl \
  # clean up
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# install libappindicator3-1 - not included with Debian 11
RUN wget --no-verbose /usr/src/libappindicator3-1_0.4.92-7_amd64.deb "http://ftp.us.debian.org/debian/pool/main/liba/libappindicator/libappindicator3-1_0.4.92-7_amd64.deb" && \
  dpkg -i /usr/src/libappindicator3-1_0.4.92-7_amd64.deb ; \
  apt-get install -f -y && \
  rm -f /usr/src/libappindicator3-1_0.4.92-7_amd64.deb

# install Chrome browser
RUN wget --no-verbose -O /usr/src/google-chrome-stable_current_amd64.deb "http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_100.0.4896.88-1_amd64.deb" && \
  dpkg -i /usr/src/google-chrome-stable_current_amd64.deb ; \
  apt-get install -f -y && \
  rm -f /usr/src/google-chrome-stable_current_amd64.deb

# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87

ARG APP_DIST_HOME

WORKDIR ${APP_DIST_HOME}
ENV APP_DIST_HOME=${APP_DIST_HOME} \
  CI=1 \
# disable shared memory X11 affecting Cypress v4 and Chrome
# https://github.com/cypress-io/cypress-docker-images/issues/270
  DBUS_SESSION_BUS_ADDRESS=/dev/null \
  QT_X11_NO_MITSHM=1 \
  _X11_NO_MITSHM=1 \
  _MITSHM=0 \
  # point Cypress at the /root/cache no matter what user account is used
  # see https://on.cypress.io/caching
  CYPRESS_CACHE_FOLDER=/root/.cache/Cypress \
  # Allow projects to reference globally installed cypress
  NODE_PATH=/usr/local/lib/node_modules

RUN echo "whoami: $(whoami)" \
  && npm config -g set user $(whoami) \
  # command "id" should print:
  # uid=0(root) gid=0(root) groups=0(root)
  # which means the current user is root
  && id \
  && npm install -g "cypress@10.2.0" "@testing-library/cypress" \
  && cypress verify \
  # Cypress cache and installed version
  # should be in the root user's home folder
  && cypress cache path \
  && cypress cache list \
  && cypress info \
  && cypress version \
  # give every user read access to the "/root" folder where the binary is cached
  # we really only need to worry about the top folder, fortunately
  && ls -la /root \
  && chmod 755 /root \
  # NPM does not need to be installed as it is already included with Node.
  # Show where Node loads required modules from
  && node -p 'module.paths' \
  # should print Cypress version
  # plus Electron and bundled Node versions
  && cypress version \
  && echo  " node version:    $(node -v) \n" \
    "npm version:     $(npm -v) \n" \
    "debian version:  $(cat /etc/debian_version) \n" \
    "user:            $(whoami) \n" \
    "chrome:          $(google-chrome --version || true) \n"


FROM cypress-base as output-cypress
ARG APP_HOME

ENV \
  CYPRESS_VIDEOS_FOLDER=/out/videos \
  CYPRESS_SCREENSHOTS_FOLDER=/out/screenshots \
  CYPRESS_DOWNLOADS_FOLDER=/out/downloads

# node user exists in the base image
RUN mkdir -p /out \
  && chown node:node /out

COPY --chown=node:node --from=builder /build/${APP_DIST_HOME} /${APP_DIST_HOME}/
COPY --chown=node:node ${APP_HOME}/entrypoint.sh .

USER node

RUN ls -al /${APP_DIST_HOME}
ENTRYPOINT ["./entrypoint.sh"]

FROM cypress-base as output-local
ARG APP_HOME

ENV \
  CYPRESS_VIDEOS_FOLDER=/out/videos \
  CYPRESS_SCREENSHOTS_FOLDER=/out/screenshots \
  CYPRESS_DOWNLOADS_FOLDER=/out/downloads

# node user exists in the base image
RUN mkdir -p /out \
  && chown node:node /out

COPY --chown=node:node ${APP_HOME}/entrypoint.sh .

USER node

RUN ls -al /${APP_DIST_HOME}
ENTRYPOINT ["./entrypoint.sh"]