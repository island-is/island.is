ARG RUST_VERSION=1.78
ARG FEDORA_VERSION=39
FROM docker.io/rust:${RUST_VERSION} as cargo

# Build dependencies
RUN --mount=type=cache,target=/var/cache/apt \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  make=4.3-4.1 cmake=3.25.1-1 g++=4:12.2.0-3

# Install cargo stuff
RUN --mount=type=cache,target=/root/.cargo \
  cargo install starship


FROM registry.fedoraproject.org/fedora:${FEDORA_VERSION} as base
ENV SHELL=bash
ARG SHELL=${SHELL}
ENV USERNAME=dev
ARG USERNAME=${USERNAME}

#######################
# System dependencies #
#######################
# We're mounting the cache, so we don't need to `clean all` (DL3040).
# Tried pinning versions, but got errors from version solver (DL3041).
# hadolint ignore=DL3040,DL3041
RUN --mount=type=cache,target=/var/cache/dnf \
  dnf install -y \
  java-11-openjdk gcc-c++ jq graphviz \
  # AWS/DevOps specific dependencies
  awscli2 \
  # Niceties
  bash zsh the_silver_searcher ripgrep fzf neovim

# Create user and environment
RUN useradd -m -s /bin/${SHELL} -G wheel ${USERNAME}
USER ${USERNAME}
WORKDIR /home/${USERNAME}

######################
# User configuration #
######################

# Set up node/yarn
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -s https://get.volta.sh | ${SHELL}
COPY package.json .
RUN . ~/.${SHELL}rc && volta install "node@$(jq -r '.engines.node' package.json)"


COPY --from=cargo /usr/local/cargo/bin/starship /usr/local/bin/

# Set up user's shell config
# Initialize starship prompt
RUN echo "eval \"\$(starship init ${SHELL})\"" >> /home/${USERNAME}/.${SHELL}rc && \
  # Set vi mode in shell
  echo "set -o vi" >> ~/.${SHELL}rc

# The local machine ID is different from the host, so we get NX cache poisoning warnings.
# This "fixes" it, but not very clean.
# Docs: https://nx.dev/troubleshooting/unknown-local-cache
# https://stackoverflow.com/a/63148464
# RUN echo "NX_REJECT_UNKNOWN_LOCAL_CACHE=0" >> /home/${USERNAME}/.${SHELL}rc

