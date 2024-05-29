ARG RUST_VERSION=1.78
ARG FEDORA_VERSION=39
FROM rust:${RUST_VERSION} as cargo

# Build dependencies
# Versions should be pinned, but 🤷
# hadolint ignore=DL3008
RUN --mount=type=cache,target=/var/cache/apt \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  make cmake g++

# Install cargo stuff
RUN --mount=type=cache,target=/root/.cargo \
  cargo install starship


FROM fedora:${FEDORA_VERSION} as base
ENV SHELL=bash
ARG SHELL=${SHELL}
ENV USERNAME=dev
ARG USERNAME=${USERNAME}

#######################
# System dependencies #
#######################
# We're mounting the cache, so we don't need to `clean all` (DL3040).
# System packages are pretty stable in Fedora, so we're not pinning versions.
# hadolint ignore=DL3040,DL3041
RUN --mount=type=cache,target=/var/cache/dnf \
  dnf install -y \
  java-11-openjdk g++ jq yq graphviz \
  # AWS/DevOps specific dependencies
  dnf install -y \
  awscli2 \
  # Niceties
  ${SHELL} the_silver_searcher ripgrep fzf neovim

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

