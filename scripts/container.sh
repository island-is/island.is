#!/bin/bash

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
