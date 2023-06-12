#!/bin/bash

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

parse_args() {
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
    run_cmd+=" yarn run $yarn_args"
  fi

  echo "Running container using: $run_cmd"
  $run_cmd
}

parse_args "$@"
