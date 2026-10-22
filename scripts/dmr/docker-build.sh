#!/usr/bin/env bash
# DMR judicial-system image builder.
#
# Builds one judicial service image from the pruned monorepo using the shared
# multi-stage Dockerfile (scripts/ci/Dockerfile). This is the DMR-local / GitHub
# Actions path: NO island.is S3 buildkit cache and NO Nx Cloud token (the
# Dockerfile runs cacheless when the token is empty). Image type (express-yarn
# vs next) and build args are read from scripts/dmr/docker-build-matrix.json.
#
# Usage:
#   scripts/dmr/docker-build.sh <service> [--load|--push] [--tag <tag>]
#   scripts/dmr/docker-build.sh all       [--load|--push] [--tag <tag>]
#
#   --load (default) puts the image in the local docker image store.
#   --push           pushes it to $DOCKER_REGISTRY instead.
#
# Env:
#   DOCKER_REGISTRY   target registry/repo prefix (default: judicial-system, i.e. local)
#                     DMR dev: 592944621100.dkr.ecr.eu-west-1.amazonaws.com
#   DOCKER_TAG        image tag (default: dev_<sha7>_<nonce>, the scheme the
#                     ECS Terraform consumes; overridable with --tag)
#   PLATFORM          build platform (default: linux/amd64 — ECS/Fargate)
#
# The tag used is printed on the last line (TAG=<tag>) so CI can capture it.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." >/dev/null 2>&1 && pwd)"
MATRIX="$ROOT/scripts/dmr/docker-build-matrix.json"
DOCKERFILE="$ROOT/scripts/ci/Dockerfile"

default_tag() {
  local sha
  sha="$(git -C "$ROOT" rev-parse --short=7 HEAD 2>/dev/null || echo unknown)"
  echo "dev_${sha}_$(openssl rand -hex 8)"
}

REGISTRY="${DOCKER_REGISTRY:-judicial-system}"
TAG="${DOCKER_TAG:-$(default_tag)}"
PLATFORM="${PLATFORM:-linux/amd64}"
PUBLISH=(--load)

# Empty Nx Cloud token => Dockerfile builds without remote cache (allowed).
# Kept outside the repo and removed on any exit, including a failed build.
TOKEN_FILE="$(mktemp "${TMPDIR:-/tmp}/nx_cloud_token.XXXXXX")"
trap 'rm -f "$TOKEN_FILE"' EXIT

usage() { echo "usage: $0 <service|all> [--load|--push] [--tag <tag>]" >&2; exit 2; }

SERVICE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --push) PUBLISH=(--push); shift ;;
    --load) PUBLISH=(--load); shift ;;
    --tag)  [[ -n "${2-}" && "${2-}" != -* ]] || usage; TAG="$2"; shift 2 ;;
    -*)     echo "unknown option: $1" >&2; usage ;;
    *)      [[ -z "$SERVICE" ]] || { echo "only one service per call (or 'all')" >&2; usage; }
            SERVICE="$1"; shift ;;
  esac
done
[[ -n "$SERVICE" ]] || usage

build_one() {
  local name="$1"
  local row app home target
  row="$(jq -c --arg n "$name" '.services[] | select(.name==$n)' "$MATRIX")"
  [[ -z "$row" ]] && { echo "unknown service: $name"; exit 2; }
  app="$(jq -r '.app' <<<"$row")"
  home="$(jq -r '.home' <<<"$row")"
  target="$(jq -r '.target' <<<"$row")"
  local dist="dist/$home"

  echo "==> building $name  (app=$app target=$target tag=$TAG)"
  docker buildx build \
    --platform="$PLATFORM" \
    --file="$DOCKERFILE" \
    --target="$target" \
    --secret "id=nx_cloud_access_token,src=$TOKEN_FILE" \
    --build-arg="APP=$app" \
    --build-arg="APP_HOME=$home" \
    --build-arg="APP_DIST_HOME=$dist" \
    --build-arg="GIT_BRANCH=$(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)" \
    --build-arg="GIT_COMMIT_SHA=$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo unknown)" \
    --build-arg="GIT_REPOSITORY_URL=$(git -C "$ROOT" remote get-url origin 2>/dev/null || echo unknown)" \
    --build-arg="PLAYWRIGHT_VERSION=1.0.0" \
    -t "$REGISTRY/$app:$TAG" \
    "${PUBLISH[@]}" \
    "$ROOT"
}

if [[ "$SERVICE" == "all" ]]; then
  for s in $(jq -r '.services[].name' "$MATRIX"); do build_one "$s"; done
else
  build_one "$SERVICE"
fi
echo "TAG=$TAG"
