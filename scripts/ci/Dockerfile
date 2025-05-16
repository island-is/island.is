# ------------------------------------------------
# Shared arguments (for images that need them early)
# ------------------------------------------------
ARG PLAYWRIGHT_VERSION

# ------------------------------------------------
# Dependencies stage (no app-specific args)
# ------------------------------------------------
FROM public.ecr.aws/docker/library/node:20.15.0-bookworm-slim AS base

# Don't care about package versions
# hadolint ignore=DL3008
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  git python3 build-essential jq gcc && \
  ln -sf /usr/bin/python3 /usr/bin/python


FROM base AS deps

WORKDIR /build

COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/patches .yarn/patches
COPY .yarn/releases .yarn/releases
COPY apps/native/app/package.json ./apps/native/app/

# Mounting, so no need for `yarn clean`
# hadolint ignore=DL3060
RUN --mount=type=cache,target=.yarn/cache,sharing=locked \
  YARN_ENABLE_HARDENED_MODE=0 yarn install --immutable

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
# Don't care about package versions
# hadolint ignore=DL3016
RUN npm install -g sequelize sequelize-cli pg
USER runner

# ------------------------------------------------
# Express output
# ------------------------------------------------
FROM output-base-with-pg AS output-express

ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENV GIT_BRANCH=${GIT_BRANCH} \
  GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL} \
  DD_GIT_BRANCH=${GIT_BRANCH} \
  DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}

LABEL branch=${GIT_BRANCH} commit=${GIT_COMMIT_SHA}

CMD ["node", "--no-experimental-fetch", "main.js"]

# ------------------------------------------------
# Next.js output
# ------------------------------------------------
FROM output-base-with-pg AS output-next

ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

ENV PORT=4200

COPY --from=deps /build/node_modules /webapp/node_modules
COPY --from=builder /build/${APP_DIST_HOME} /webapp/

ENV GIT_BRANCH=${GIT_BRANCH} \
  GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL} \
  DD_GIT_BRANCH=${GIT_BRANCH} \
  DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}

LABEL branch=${GIT_BRANCH} commit=${GIT_COMMIT_SHA}

CMD ["node", "main.js"]

# ------------------------------------------------
# Static output (NGINX)
# ------------------------------------------------
FROM public.ecr.aws/docker/library/nginx:1.21-alpine AS static-base

# Don't care about package versions
# hadolint ignore=DL3018
RUN apk update && apk upgrade && apk add --no-cache bash nodejs
RUN mkdir -p /etc/nginx/templates

FROM static-base AS output-static

ARG APP
ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

COPY scripts/dockerfile-assets/nginx/* /etc/nginx/templates
COPY scripts/dockerfile-assets/bash/extract-environment.* /docker-entrypoint.d/
COPY --from=builder /build/${APP_DIST_HOME} /usr/share/nginx/html

ENV GIT_BRANCH=${GIT_BRANCH} \
  GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL} \
  DD_GIT_BRANCH=${GIT_BRANCH} \
  DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL} \
  APP=${APP} \
  BASEPATH=/

LABEL branch=${GIT_BRANCH} commit=${GIT_COMMIT_SHA}

# ------------------------------------------------
# Jest output
# ------------------------------------------------
FROM output-base AS output-jest

RUN echo 'module.exports = {};' > jest.config.js

ARG APP_DIST_HOME
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

# Don't care about package versions
# hadolint ignore=DL3016
RUN npm install -g jest

COPY --from=builder /build/${APP_DIST_HOME} /webapp/

USER runner

ENV GIT_BRANCH=${GIT_BRANCH} \
  GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL} \
  DD_GIT_BRANCH=${GIT_BRANCH} \
  DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}

LABEL branch=${GIT_BRANCH} commit=${GIT_COMMIT_SHA}

CMD ["jest", "main.spec.js"]

# ------------------------------------------------
# Playwright base
# ------------------------------------------------
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-focal AS playwright-base

# ------------------------------------------------
# Playwright output
# ------------------------------------------------
FROM playwright-base AS output-playwright

ARG APP_DIST_HOME
ARG APP_HOME
ARG PLAYWRIGHT_BROWSER=chromium
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

# Don't care about package versions
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
RUN mkdir ./.yarn
COPY .yarn/releases ./.yarn/releases
RUN YARN_ENABLE_HARDENED_MODE=0 yarn install --immutable && yarn playwright install "${PLAYWRIGHT_BROWSER}"

COPY --chown=pwuser:pwuser --chmod=0755 ${APP_HOME}/entrypoint.sh .

ENV GIT_BRANCH=${GIT_BRANCH} \
  GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL} \
  DD_GIT_BRANCH=${GIT_BRANCH} \
  DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA} \
  DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}

LABEL branch=${GIT_BRANCH} commit=${GIT_COMMIT_SHA}

ENTRYPOINT ["./entrypoint.sh"]

# ------------------------------------------------
# Native output (placeholder)
# ------------------------------------------------
FROM output-base AS output-native
RUN echo "not-implemented"
