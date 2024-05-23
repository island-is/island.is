FROM rust:latest as cargo

# Build dependencies
RUN --mount=type=cache,target=/var/cache/apt \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  make cmake g++

# Install cargo stuff
RUN --mount=type=cache,target=/root/.cargo \
  cargo install starship


# FROM ubuntu:latest as base
FROM fedora:latest as base
ENV SHELL=bash
ARG SHELL=${SHELL}
ENV USERNAME=dev
ARG USERNAME=${USERNAME}

#######################
# System dependencies #
#######################
RUN --mount=type=cache,target=/var/cache/dnf \
  dnf install -y \
  java-11-openjdk g++ jq yq
# Set up AWS specific env
RUN --mount=type=cache,target=/var/cache/dnf \
  dnf install -y \
  awscli2

# Niceties
RUN --mount=type=cache,target=/var/cache/dnf \
  dnf install -y \
  ${SHELL} the_silver_searcher ripgrep fzf neovim

# Create user and environment
RUN useradd -m -s /bin/${SHELL} ${USERNAME}
USER ${USERNAME}
WORKDIR /home/${USERNAME}

######################
# User configuration #
######################

# Set up node/yarn
RUN curl -s https://get.volta.sh | ${SHELL}
COPY package.json .
RUN . ~/.${SHELL}rc && volta install node@$(jq -r '.engines.node' package.json)


COPY --from=cargo /usr/local/cargo/bin/starship /usr/local/bin/

# Set up user's shell config
RUN echo "eval \"\$(starship init ${SHELL})\"" >> /home/${USERNAME}/.${SHELL}rc && \
  echo "set -o vi" >> ~/.${SHELL}rc
# The local machine ID is different from the host, so we get NX cache poisoning warnings.
# This "fixes" it, but not very clean.
# Docs: https://nx.dev/troubleshooting/unknown-local-cache
# https://stackoverflow.com/a/63148464
# RUN echo "NX_REJECT_UNKNOWN_LOCAL_CACHE=0" >> /home/${USERNAME}/.${SHELL}rc

