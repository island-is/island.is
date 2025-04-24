ARG RUST_VERSION=1.81
ARG FEDORA_VERSION=39
FROM docker.io/rust:${RUST_VERSION} AS cargo-bins

# Build dependencies
RUN --mount=type=cache,target=/var/cache/apt \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  make=4.3-4.1 cmake=3.25.1-1 g++=4:12.2.0-3

# Install cargo binaries
RUN rustc --version && cargo --version && \
    cargo install starship --version 1.20.1 --verbose

FROM docker.io/rust:${RUST_VERSION} as cargo-volta
WORKDIR /build/volta
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN --mount=type=cache,target=/root/.cargo/ --mount=type=cache,target=/root/.cache/ \
  git init && \
  (git remote | grep -q origin || git remote add origin https://github.com/volta-cli/volta) && \
  git fetch origin && \
  git checkout origin/main --force && \
  cargo build --release
RUN ls -lah . && ls -lah -R target/


FROM registry.fedoraproject.org/fedora:${FEDORA_VERSION} as base

#######################
# System dependencies #
#######################
# We're mounting the cache, so we don't need to `clean all` (DL3040).
# Tried pinning versions, but got errors from version solver (DL3041).
# hadolint ignore=DL3040,DL3041
RUN --mount=type=cache,target=/var/cache/dnf \
  dnf install -y \
  # Basic requirements
  bash zsh git java-11-openjdk gcc-c++ jq graphviz python3-devel \
  # AWS/DevOps specific dependencies
  awscli2 \
  # Niceties
  the_silver_searcher ripgrep fzf neovim

ENV SHELL=bash
ARG SHELL=${SHELL}
ENV USERNAME=root
ARG USERNAME=${USERNAME}

# Create user and environment
RUN grep "${USERNAME}" /etc/passwd || useradd -m -s /bin/${SHELL} -G wheel ${USERNAME}
USER ${USERNAME}
WORKDIR /tmp/build-workdir



######################
# User configuration #
######################


# "Install" volta & starship
COPY --from=cargo-bins /usr/local/cargo/bin/starship /usr/local/bin/
COPY --from=cargo-volta \
  /build/volta/target/release/volta \
  /build/volta/target/release/volta-shim \
  /build/volta/target/release/volta-migrate \
  /usr/local/bin/

RUN volta setup

# Set up node/yarn
COPY package.json .
RUN . ~/.${SHELL}rc && volta install "node@$(jq -r '.engines.node' package.json)"

# Install brew for additional binaries
RUN \
  touch /.dockerenv && \
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && \
  rm /.dockerenv

# Set up user's shell config
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN \
  # Initialize starship prompt
  echo "eval \"\$(starship init ${SHELL})\"" | tee -a ~/.${SHELL}rc && \
  # Set vi mode in shell
  echo "set -o vi" | tee -a ~/.${SHELL}rc \
  # Set default AWS_PROFILE
  echo "export AWS_PROFILE=islandis-dev" | tee -a ~/.${SHELL}rc

# The local machine ID is different from the host, so we get NX cache poisoning warnings.
# This "fixes" it, but not very clean.
# Docs: https://nx.dev/troubleshooting/unknown-local-cache
# https://stackoverflow.com/a/63148464
# RUN echo "NX_REJECT_UNKNOWN_LOCAL_CACHE=0" >> /home/${USERNAME}/.${SHELL}rc

WORKDIR /workspaces/island.is
