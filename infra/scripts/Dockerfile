FROM public.ecr.aws/docker/library/node:20.15.0-bookworm-slim AS runner

# hadolint ignore=DL3018
RUN apt-get update && apt-get install -y \
  postgresql \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

FROM public.ecr.aws/docker/library/node:20.15.0-bookworm-slim AS build
WORKDIR /app/infra
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY infra/.yarnrc.yml infra/package.json infra/yarn.lock ./
COPY infra/.yarn/releases .yarn/releases
RUN ls -al
RUN yarn --version

RUN yarn install --immutable

COPY infra/ ./
COPY apps /app/apps/
COPY libs /app/libs/

RUN yarn ncc build src/feature-env.ts -o /app/dist/feature-env && \
  yarn ncc build src/secrets.ts -o /app/dist/secrets

FROM runner
WORKDIR /app

COPY --from=build /app/dist/ /app
COPY infra/scripts/container-scripts/* /app/
COPY infra/scripts/update-package-json.ts /app/

ENTRYPOINT [ "node", "feature-env" ]
