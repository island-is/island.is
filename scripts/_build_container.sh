#!/bin/bash

set -euo pipefail

print_usage() {
  echo "Usage: build-container.sh [OPTIONS]"
  echo "Options:"
  echo "  -t, --target            Set the target build stage"
  echo "  -f, --dockerfile        Specify the Dockerfile to use (default: Dockerfile)"
  echo "  -p, --publish           Publish the image to a registry with the specified tag"
  echo "  -c, --cache-from        Cache images from the specified source (defaut: localhost)"
  echo "  -h, --help              Show this help message"
}

parse_args() {
  local target="localrun"
  local dockerfile="Dockerfile"
  local publish=""
  local tag="latest"
  local cache_from="local"

  while [[ $# -gt 0 ]]; do
    case $1 in
    -t | --target)
      target="$2"
      shift 2
      ;;
    -f | --dockerfile)
      dockerfile="$2"
      shift 2
      ;;
    -p | --publish)
      publish="$2"
      shift 2
      ;;
    -c | --cache-from)
      cache_from="$2"
      shift 2
      ;;
    --tag)
      tag="$2"
      shift 2
      ;;
    -h | --help)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
    esac
  done

  build_container "$dockerfile" "$target" "$tag" "$publish" "$cache_from"
}

build_container() {
  local dockerfile=$1
  local target=$2
  local tag=$3
  local _publish=$4
  local cache_from=$5

  local build_cmd=""
  if command -v podman &>/dev/null; then
    build_cmd="podman build"
    if [[ -n $cache_from ]]; then
      build_cmd+=" --cache-from $cache_from"
    fi
  elif command -v docker &>/dev/null; then
    build_cmd="DOCKER_BUILDKIT=1 docker build"
    if [[ -n $cache_from ]]; then
      build_cmd+=" --cache-from $cache_from"
    fi
  else
    echo "Neither Podman nor Docker is installed. Please install one of them."
    exit 1
  fi

  if [[ -n $tag ]]; then
    build_cmd+=" --tag $target:$tag"
  fi

  if [[ -n $target ]]; then
    build_cmd+=" --target $target"
  fi

  if [[ -n $dockerfile ]]; then
    build_cmd+=" --file $dockerfile"
  fi

  build_cmd+=" ."

  echo "Building container using: $build_cmd"
  $build_cmd
}

parse_args "$@"
