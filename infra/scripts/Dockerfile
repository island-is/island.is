FROM public.ecr.aws/docker/library/node:22.22.3-bookworm-slim AS runner

# hadolint ignore=DL3018
RUN apt-get update && apt-get install -y \
  postgresql \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

FROM public.ecr.aws/docker/library/node:22.22.3-bookworm-slim AS build
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
COPY nx.json /app/workspace-metadata/nx.json

RUN cd /app && \
  find apps libs -type f -name project.json \
    -exec cp --parents {} workspace-metadata/ \;

RUN yarn ncc build src/feature-env.ts -o /app/dist/feature-env && \
  yarn ncc build src/secrets.ts -o /app/dist/secrets

FROM runner
WORKDIR /app

COPY --from=build /app/dist/ /app
COPY --from=build /app/workspace-metadata/ /app/
COPY infra/scripts/container-scripts/* /app/
COPY infra/scripts/update-package-json.ts /app/

RUN node feature-env --help > /dev/null

ENTRYPOINT [ "node", "feature-env" ]
