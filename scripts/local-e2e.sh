#!/bin/bash

set -euo pipefail

. "./scripts/ci/_common.sh"
. "./scripts/utils.sh"

export APP="${APP:-system-e2e}"
export DOCKER_TAG="${DOCKER_TAG:-latest}"
export CI=""
export PUBLISH=local

print_build_usage() {
  echo "Usage: build-container.sh [OPTIONS]"
  echo "Options:"
  echo "  -t, --target            Set the target build stage"
  echo "  -f, --dockerfile        Specify the Dockerfile to use (default: Dockerfile)"
  echo "  -p, --publish           Publish the image to a registry with the specified tag"
  # echo "  -c, --cache-from        Cache images from the specified source (defaut: localhost)"
  echo "  -h, --help              Show this help message"
}

parse_build_args() {
  local target="output-playwright"
  local dockerfile="Dockerfile"
  local tag="latest"

  while [[ $# -gt 0 ]]; do
    case "$1" in
    -t | --target)
      target="$2"
      shift 2
      ;;
    -f | --dockerfile)
      dockerfile="$2"
      shift 2
      ;;
    -p | --publish)
      export PUBLISH=true
      shift 2
      ;;
    --tag)
      tag="$2"
      shift 2
      ;;
    -h | --help)
      print_build_usage
      exit 0
      ;;
    *)
      warning "Unknown $0 build option: $1"
      info "Ending argument parsing for $0"
      break
      ;;
    esac
  done

  ./scripts/ci/_podman.sh "$dockerfile" "$target"
}

print_run_usage() {
  echo "Usage: run-container.sh [OPTIONS] [--] <yarn run arguments>"
  echo "Options:"
  echo "  -h, --help                       Show this help message"
  echo "  -i, --image                      Specify the name of the container image (localhost/IMAGE:tag)"
  echo "  -v, --volume                     Mount the specified directory as a volume for caching"
  echo "  -t, --tag TAG                    Specify the tag of the container image (localhost/image:TAG)"
  echo "  --ci                             Run in CI mode"
  echo "  -e, --env A=B                    Specify environment variables to pass to the container"
  echo "  --secrets-file, --env-file FILE  Specify secrets files to pass to the container"
  echo "  --secrets-out-file FILE          Specify output file for secrets"
  echo "  -n, --dry                        Dry run"
}

parse_run_args() {
  local image="localhost/$APP"
  local yarn_args=""
  local run_args=""
  local tag="latest"
  local env=()
  local secrets_files=(".env.secret")
  local dryrun=false
  local secrets_out_file=".env.local-e2e"
  local volumes=()
  local playwright_output=true

  while [[ $# -gt 0 ]]; do
    case "$1" in
    --)
      shift
      run_args="$*"
      break
      ;;
    -h | --help)
      print_run_usage
      exit 0
      ;;
    --no-playwright-output)
      playwright_output=false
      shift
      ;;
    -i | --image)
      image="$2"
      shift 2
      ;;
    -v | --volume)
      volumes+=("$2")
      shift 2
      ;;
    -t | --tag)
      shift 2
      ;;
    --ci)
      info "Running in CI mode"
      export CI=true
      shift
      ;;
    -e | --env)
      env+=("$2")
      shift 2
      ;;
    --secrets-file | --env-file)
      secrets_files+=("$2")
      shift 2
      ;;
    --secrets-out-file)
      secrets_out_file="$2"
      shift 2
      ;;
    -n | --dry)
      dryrun=true
      shift
      ;;
    run | yarn)
      shift
      ;;
    *)
      warning "Unknown $0 run option: $1"
      info "Ending argument parsing for $0"
      yarn_args="$*"
      break
      ;;
    esac
  done

  debug "Set yarn_args: $yarn_args"

  local container_name=${image##*/}

  local run_cmd=""
  if command -v podman &>/dev/null; then
    run_cmd="podman run --userns=keep-id"
  elif command -v docker &>/dev/null; then
    run_cmd="docker run"
  else
    error "Neither Podman nor Docker is installed. Please install one of them."
    exit 1
  fi

  # Container runner arguments
  run_cmd+=" --rm"
  run_cmd+=" -it"
  run_cmd+=" --name ${container_name##*/}"
  run_cmd+=" --publish-all"

  # If volumes array is not empty
  if [[ "${#volumes[@]}" -gt 0 ]]; then
    for volume in "${volumes[@]}"; do
      if ! [[ "$volume" =~ : ]]; then
        volume+=":/data/${volume}:z"
      fi
      run_cmd+=" --volume $volume"
    done
  fi

  for e in "${env[@]}"; do
    run_cmd+=" --env $e"
  done

  debug "Loading secrets from secrets files"
  echo 'LOCAL_E2E=true' >"$secrets_out_file"
  for secrets_file in "${secrets_files[@]}"; do
    # local secrets_out_file_looped="$secrets_out_file-$(sha1sum "$secrets_out_file" | head -c 8)"
    if ! [[ -f "$secrets_file" ]]; then continue; fi
    info "Loading secrets from $secrets_file"
    # Parse secrets
    while read -r secret; do
      if [[ -z "$secret" ]]; then continue; fi
      if ! [[ "$secret" =~ = ]] || ! [[ "$secret" =~ ^\s*[a-zA-Z] ]]; then
        debug "Skipping invalid secret: $secret"
        continue
      fi
      secret="${secret#export }"
      local key="${secret%%=*}"
      local value="${secret#*=}"
      case "$key" in
      '#'* | '') continue ;;
      esac
      local evalue
      if ! evalue="$(
        eval "$secret"
        debug "Key: '$key'"
        debug "Value: '$value'"
        debug "indirect value: $key=${!key}"
        echo "${!key}"
      )" >/dev/null; then
        debug "Failed setting secret: $secret"
        continue
      fi
      debug "Evalued value: $evalue"
      echo "${key}=${evalue}" >>"$secrets_out_file"
    done <"$secrets_file"
  done
  run_cmd+=" --env-file $secrets_out_file"

  if [[ "$playwright_output" == true ]]; then
    local playwright_report="$PWD/dist/playwright-report"
    mkdir -p "$playwright_report"
    run_cmd+=" --volume $playwright_report:/dist/apps/system-e2e/playwright-report:z"
  fi

  # Image to use
  run_cmd+=" $image:$tag"

  # Image/program arguments
  if [[ -n "$yarn_args" ]]; then
    # yarn_args=" yarn $yarn_args"
    run_cmd+=" $yarn_args"
  fi

  if [[ -n "$run_args" ]]; then
    run_cmd+=" $run_args"
  fi

  info "Running container using: $run_cmd"
  if [[ "$dryrun" == true ]]; then
    info "Running in dry mode"
    echo "$run_cmd"
    return
  fi
  $run_cmd
}

print_general_usage() {
  echo "Usage: container.sh [COMMAND]"
  echo "Commands:"
  echo "  build [OPTIONS]        Build the container image"
  echo "  run [OPTIONS]          Run the container"
}

parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    build)
      shift
      parse_build_args "$@"
      return
      ;;
    run)
      shift
      parse_run_args "$@"
      return
      ;;
    -h | --help)
      print_general_usage
      exit 0
      ;;
    *)
      error "Unknown command: $1"
      print_general_usage
      exit 1
      ;;
    esac
  done
  print_general_usage
}

parse_arguments "$@"
