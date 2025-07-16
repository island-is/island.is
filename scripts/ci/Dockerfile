# ------------------------------------------------
# Shared arguments (for images that need them early)
# ------------------------------------------------
ARG PLAYWRIGHT_VERSION

# ------------------------------------------------
# Dependencies stage (no app-specific args)
# ------------------------------------------------
FROM public.ecr.aws/docker/library/node:20.15.0-bookworm-slim AS base

# hadolint ignore=DL3008
RUN apt-get update && \
  apt-get install -y --no-install-recommends git python3 build-essential jq gcc && \
  ln -sf /usr/bin/python3 /usr/bin/python && \
  rm -rf rm -rf /var/lib/apt/lists/*



FROM base AS deps

WORKDIR /build

COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/patches .yarn/patches
COPY .yarn/releases .yarn/releases
COPY apps/native/app/package.json ./apps/native/app/

RUN yarn install --immutable && yarn cache clean

# ------------------------------------------------
# Copy monorepo source
# ------------------------------------------------
FROM deps AS src

COPY . .

# ------------------------------------------------
# Build stage (app-specific args start here)
# ------------------------------------------------
FROM src AS builder

ARG APP
ARG APP_HOME
ARG APP_DIST_HOME
ARG NX_PARALLEL=2
ARG NX_MAX_PARALLEL=4
ARG NX_TASKS_RUNNER=ci

ENV CI=true \
  NODE_ENV=production \
  NODE_OPTIONS="--max-old-space-size=8192" \
  NX_PARALLEL=${NX_PARALLEL} \
  NX_MAX_PARALLEL=${NX_MAX_PARALLEL} \
  NX_TASKS_RUNNER=${NX_TASKS_RUNNER} \
  NX_VERBOSE_LOGGING=true \
  APP=${APP}

# Build with Nx Cloud caching. If credentials are missing or invalid, build will run without caching
RUN echo "APP=${APP}, APP_HOME=${APP_HOME}, APP_DIST_HOME=${APP_DIST_HOME}"
RUN --mount=type=secret,id=nx_cloud_access_token \
  NX_CLOUD_ACCESS_TOKEN="$(cat /run/secrets/nx_cloud_access_token)" yarn run build ${APP} --prod

# ------------------------------------------------
# Minimal node base for outputs
# ------------------------------------------------
FROM public.ecr.aws/docker/library/node:20.15.0-bookworm-slim AS output-base
ENV NODE_ENV=production
WORKDIR /webapp
RUN groupadd runners && useradd -m -g runners runner

# ------------------------------------------------
# Base + pg
# ------------------------------------------------
FROM output-base AS output-base-with-pg
# hadolint ignore=DL3016
RUN npm install -g sequelize sequelize-cli pg
USER runner

# ------------------------------------------------
# Express output
# ------------------------------------------------
FROM output-base-with-pg AS output-express

ARG APP_DIST_HOME

COPY --from=builder /build/${APP_DIST_HOME} /webapp/


CMD ["node", "--no-experimental-fetch", "main.js"]

# ------------------------------------------------
# Next.js output
# ------------------------------------------------
FROM output-base-with-pg AS output-next

ARG APP_DIST_HOME

ENV PORT=4200

ARG APP
ARG APP_HOME
ARG APP_DIST_HOME
RUN echo "APP=${APP}, APP_HOME=${APP_HOME}, APP_DIST_HOME=${APP_DIST_HOME}"

COPY --from=deps /build/node_modules /webapp/node_modules
COPY --from=builder /build/${APP_DIST_HOME} /webapp/

CMD ["node", "main.js"]

# ------------------------------------------------
# Static output (NGINX)
# ------------------------------------------------
FROM public.ecr.aws/docker/library/nginx:1.21-alpine AS static-base

# hadolint ignore=DL3018
RUN apk update && apk upgrade && apk add --no-cache bash nodejs
RUN mkdir -p /etc/nginx/templates

FROM static-base AS output-static

ARG APP
ARG APP_DIST_HOME

COPY scripts/dockerfile-assets/nginx/* /etc/nginx/templates
COPY scripts/dockerfile-assets/bash/extract-environment.* /docker-entrypoint.d/
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html

ENV APP=${APP} BASEPATH=/


# ------------------------------------------------
# Jest output
# ------------------------------------------------
FROM output-base AS output-jest

ARG APP_DIST_HOME

RUN echo 'module.exports = {};' > jest.config.js
# hadolint ignore=DL3016,DL3059
RUN npm install -g jest

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

USER runner

CMD ["jest", "main.spec.js"]

# ------------------------------------------------
# Playwright base
# ------------------------------------------------
FROM mcr.microsoft.com/playwright:v1.48.2-focal AS playwright-base

# ------------------------------------------------
# Playwright output
# ------------------------------------------------
FROM playwright-base AS output-playwright

ARG APP_DIST_HOME
ARG APP_HOME
ARG PLAYWRIGHT_BROWSER=chromium

# hadolint ignore=DL3008
RUN apt-get update && \
  apt-get install -y --no-install-recommends zip awscli && \
  apt-get purge -y && \
  rm -rf /var/lib/apt/lists/*

WORKDIR ${APP_DIST_HOME}

COPY --from=builder /build/${APP_DIST_HOME} .
COPY ${APP_HOME}/package.json .
RUN chown -R pwuser:pwuser .

USER pwuser

COPY .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
RUN yarn install && \
  yarn playwright install ${PLAYWRIGHT_BROWSER}

COPY --chown=pwuser:pwuser --chmod=0755 ${APP_HOME}/entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]

# ------------------------------------------------
# Native output (placeholder)
# ------------------------------------------------
FROM output-base AS output-native
RUN echo "not-implemented"
