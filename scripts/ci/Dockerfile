# ------------------------------------------------
# Shared arguments (for images that need them early)
# ------------------------------------------------
ARG PLAYWRIGHT_VERSION

# ------------------------------------------------
# Dependencies stage (no app-specific args)
# ------------------------------------------------
FROM public.ecr.aws/docker/library/node:20.15.0-bookworm-slim AS base

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
  apt-get update && \
  apt-get install -y \
  git \
  python3 \
  build-essential \
  jq \
  gcc && \
  ln -sf /usr/bin/python3 /usr/bin/python


FROM base AS deps

WORKDIR /build

COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/patches .yarn/patches
COPY .yarn/releases .yarn/releases
COPY apps/native/app/package.json ./apps/native/app/

RUN --mount=type=cache,target=.yarn/cache,sharing=locked \
  yarn install --immutable


# ------------------------------------------------
# Copy monorepo source
# ------------------------------------------------
FROM deps AS src

COPY . ./

# ------------------------------------------------
# Export APP_HOME
# ------------------------------------------------
FROM src AS app-home
ARG APP
ENV APP=${APP}
RUN APP_HOME=$(yarn nx show project "${APP}" | jq ".root" -r) && \
  echo "${APP_HOME}" > /app_home


# ------------------------------------------------
# Build stage (app-specific args start here)
# ------------------------------------------------
FROM src AS builder

ARG APP
ARG NX_PARALLEL=2
ARG NX_MAX_PARALLEL=4
ARG NX_TASKS_RUNNER=ci

ENV NODE_ENV=production \
  NODE_OPTIONS="--max-old-space-size=8192" \
  NX_PARALLEL=${NX_PARALLEL} \
  NX_MAX_PARALLEL=${NX_MAX_PARALLEL} \
  NX_TASKS_RUNNER=${NX_TASKS_RUNNER} \
  APP=${APP}

COPY --from=app-home /app_home /app_home
RUN --mount=type=secret,id=nx_cloud_access_token \
  bash -c ' \
  export NX_CLOUD_ACCESS_TOKEN=$(cat /run/secrets/nx_cloud_access_token) && \
  export APP_HOME=$(cat /app_home) && \
  yarn run build ${APP} --prod \
  '

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
RUN npm install -g sequelize sequelize-cli pg
USER runner

# ------------------------------------------------
# Express output
# ------------------------------------------------
FROM output-base-with-pg AS output-express

ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

COPY --from=app-home /app_home /app_home
COPY --from=builder /build/dist/$(cat /app_home) /webapp/

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

ARG APP
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

ENV PORT=4200

COPY --from=app-home /app_home /app_home
COPY --from=deps /build/node_modules /webapp/node_modules
COPY --from=builder /build/dist/$(cat /app_home) /webapp/

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
FROM public.ecr.aws/docker/library/nginx:1.21-alpine AS output-static

ARG APP
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

RUN apk update && apk upgrade && apk add --no-cache bash nodejs
RUN mkdir -p /etc/nginx/templates

COPY scripts/dockerfile-assets/nginx/* /etc/nginx/templates
COPY scripts/dockerfile-assets/bash/extract-environment.* /docker-entrypoint.d/

COPY --from=app-home /app_home /app_home
COPY --from=builder /build/dist/$(cat /app_home) /usr/share/nginx/html/

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

ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

RUN echo 'module.exports = {};' > jest.config.js
RUN npm install -g jest

COPY --from=app-home /app_home /app_home
COPY --from=builder /build/dist/$(cat /app_home) /webapp/

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
ARG PLAYWRIGHT_BROWSER=chromium
ARG GIT_BRANCH
ARG GIT_COMMIT_SHA
ARG GIT_REPOSITORY_URL

RUN apt-get update && \
  apt-get install -y zip awscli && \
  apt-get purge -y && \
  rm -rf /var/lib/apt/lists/*

COPY --from=app-home /app_home /app_home
WORKDIR $(cat /app_home)

COPY --from=builder /build/dist/$(cat /app_home) /webapp/
COPY /dist/$(cat /app_home)/package.json ./
RUN chown -R pwuser:pwuser .

USER pwuser

COPY .yarnrc.yml ./
RUN mkdir ./.yarn
COPY .yarn/releases ./.yarn/releases
RUN yarn install
RUN yarn playwright install ${PLAYWRIGHT_BROWSER}

COPY --chown=pwuser:pwuser --chmod=0755 $(cat /app_home)/entrypoint.sh ./

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
