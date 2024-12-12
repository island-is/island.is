ARG NODE_IMAGE_TAG=20.15.0-alpine3.20

# Stage 1: Install dependencies
FROM node:${NODE_IMAGE_TAG} AS dependencies

# Set working directory
WORKDIR /app

# Install Python3 and build tools
RUN apk add --no-cache python3 py3-pip make g++ && ln -sf /usr/bin/python3 /usr/bin/python

# Copy only package management files
COPY package.json yarn.lock ./
COPY .yarn/ .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY ./apps/native/app/package.json ./apps/native/app/package.json

# Install dependencies
RUN --mount=type=cache,target=/app/.yarn/cache \
    yarn install --immutable && yarn cache clean

# Stage 2: Final runtime image
FROM node:${NODE_IMAGE_TAG}

# Install Python (runtime requirement if needed)
RUN apk add --no-cache python3 py3-pip && ln -sf /usr/bin/python3 /usr/bin/python

# Enable Corepack and Yarn 3.2.3
RUN corepack enable && corepack prepare yarn@3.2.3 --activate

# Set working directory
WORKDIR /app

# Copy from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/yarn.lock ./yarn.lock
COPY --from=dependencies /app/.yarn/ ./.yarn
COPY --from=dependencies /app/.yarnrc.yml ./.yarnrc.yml

# Copy source code and necessary configuration files
COPY ./apps ./apps
COPY ./libs ./libs
COPY ./infra ./infra
COPY ./tools ./tools           
COPY ./tsconfig.base.json ./   
COPY ./tsconfig.shared.json ./      
COPY ./package.json ./          

# Verify Yarn version in runtime container
RUN yarn --version

# Default command to run the app
CMD ["yarn", "nx", "serve"]

# ARG NODE_IMAGE_TAG=20.15.0-alpine3.20
# FROM node:${NODE_IMAGE_TAG} AS build

# WORKDIR /app

# # Install build dependencies
# RUN apk add --no-cache \
#     python3 \
#     py3-pip \
#     make \
#     g++

# # Set Python symlink
# RUN ln -sf /usr/bin/python3 /usr/bin/python

# # Install dependencies
# COPY package.json yarn.lock ./
# COPY .yarn/ .yarn
# COPY .yarnrc.yml .yarnrc.yml
# COPY ./apps/native/app/package.json ./apps/native/app/package.json

# # Run yarn install
# RUN --mount=type=cache,target=/app/.yarn/cache \
# yarn install --immutable 

# # Copy source code
# COPY . .

# # Verify installation
# RUN yarn nx --version

# # Set default entrypoint
# CMD ["yarn", "nx"]