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
  java-11-openjdk g++
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
RUN curl -q https://get.volta.sh | ${SHELL}
RUN . ~/.${SHELL}rc && volta install node


COPY --from=cargo /usr/local/cargo/bin/starship /usr/local/bin/
# Set up user's shell config
RUN echo "eval \"\$(starship init ${SHELL})\"" >> /home/${USERNAME}/.${SHELL}rc && \
  echo "set -o vi" >> ~/${SHELL}rc

