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

parse_build_args() {
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

set -euo pipefail

print_usage() {
  echo "Usage: run-container.sh [OPTIONS] <yarn run arguments>"
  echo "Options:"
  # echo "  -v, --volume <directory>   Mount the specified directory as a volume for caching"
  # echo "  -c, --cache                Use yarn cache in current directory"
  echo "  -i, --image <name>         Specify the name of the container image (default: localrun)"
  echo "  -t, --tag <tag>            Specify the tag of the container image (default: latest)"
  echo "  -h, --help                 Show this help message"
}

parse_run_args() {
  local image="localhost/localrun"
  local yarn_args=""
  local tag="latest"
  # local volume="${image##*/}-cache"

  while [[ $# -gt 0 ]]; do
    case $1 in
    -h | --help)
      print_usage
      exit 0
      ;;
    -i | --image)
      image="$2"
      shift 2
      ;;
    -t | --tag)

      shift 2
      ;;
    -*)
      echo "Unknown option: $1"
      exit 1
      ;;
    run | yarn)
      shift
      ;;
    *)
      yarn_args="$*"
      break
      ;;
    esac
  done

  run_container "$image" "$tag" "$yarn_args"
}

run_container() {
  local image=$1
  local tag=$2
  local yarn_args=$3
  local container_name=${image##*/}

  local run_cmd=""
  if command -v podman &>/dev/null; then
    run_cmd="podman run"
  elif command -v docker &>/dev/null; then
    run_cmd="docker run"
  else
    echo "Neither Podman nor Docker is installed. Please install one of them."
    exit 1
  fi

  run_cmd+=" --rm"
  run_cmd+=" -it"
  run_cmd+=" --name ${container_name##*/}"
  run_cmd+=" --publish-all"

  run_cmd+=" --volume $PWD:/data:z"

  run_cmd+=" $image:$tag"

  if [[ -n $yarn_args ]]; then
    run_cmd+=" yarn $yarn_args"
  fi

  echo "Running container using: $run_cmd"
  $run_cmd
}

set -euo pipefail

DIR="$(dirname $0)"
PROGRAM_NAME="$(basename $0)"

print_usage() {
  echo "Usage: container.sh [COMMAND]"
  echo "Commands:"
  echo "  build [OPTIONS]        Build the container image"
  echo "  run [OPTIONS]          Run the container"
}

parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case $1 in
    build)
      shift
      . $DIR/_build_container.sh "$@"
      return
      ;;
    run)
      shift
      . $DIR/_run_container.sh "$@"
      return
      ;;
    -h | --help)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown command: $1"
      print_usage
      exit 1
      ;;
    esac
  done
  print_usage
}

parse_arguments "$@"
