#!/bin/bash

set -euo pipefail

: "${ACTION:=${1:-}}"
: "${MAX_MINOR:=4}"
: "${PUSH_RELEASE_BRANCH:=false}"
: "${IGNORE_EXISTING_RELEASE:=false}"
: "${RELEASE_VERSION:=}"
: "${LOCAL_VERSION:=false}"

get_last_good_sha() {
  # Should use GitHub's GraphQL API
  # We assume the current commit is good for now
  GOOD_SHA="$(git rev-parse HEAD)"
  >&2 echo "Assuming current commit is good ($GOOD_SHA)"
  echo "$GOOD_SHA"
}

get_last_release() {
  (
    if [ "$LOCAL_VERSION" = true ]; then
      git branch
    else
      git branch -r
    fi
  ) |& grep -oP '(?<=release/)(\d+\.?){3}' | sort -nr | head -n 1
}
bump_release_number() {
  local current_release major_version minor_version patch_version
  current_release="${1:-$(get_last_release)}"
  major_version="$(echo "${current_release}" | cut -d. -f1)"
  minor_version="$(echo "${current_release}" | cut -d. -f2)"
  patch_version="$(echo "${current_release}" | cut -d. -f3)"

  if [ -n "$RELEASE_VERSION" ]; then
    echo "$RELEASE_VERSION"
    return
  fi

  # Bump major, if minor is going to hit MAX_MINOR
  if [ "${minor_version}" -ge "${MAX_MINOR}" ]; then
    major_version=$((major_version + 1))
  fi

  # Bump minor, (modulo MAX_MINOR), plus 1
  minor_version=$((minor_version % MAX_MINOR + 1))

  echo "${major_version}.${minor_version}.${patch_version}"
}

create_pre_release_branch() {
  local NEW_BRANCH
  NEW_BRANCH="pre-release/$(bump_release_number)"

  # Create branch locally
  if git branch |& grep -q "$NEW_BRANCH"; then
    >&2 echo "Branch $NEW_BRANCH already exists (locally)"
    [ "$IGNORE_EXISTING_RELEASE" = true ] || return 1
  else
    git checkout -b "$NEW_BRANCH" "$(get_last_good_sha)"
  fi

  # Create branch on remote
  if git branch -r |& grep -q "$NEW_BRANCH"; then
    >&2 echo "Branch $NEW_BRANCH already exists (on remote)"
    sleep 1
    [ "$IGNORE_EXISTING_RELEASE" = true ] || return 1
  fi

  # Push branch
  if [ "$PUSH_RELEASE_BRANCH" = true ]; then
    echo "Pushing branch $NEW_BRANCH"
    git push --set-upstream origin "pre-release/$(bump_release_number)"
  else
    echo "Skipping pushing branch $NEW_BRANCH (set --push-release-branch to push)"
  fi
  echo "Successfully created branch $NEW_BRANCH (locally and remotely)"
}

describe_release() {
  CURRENT_RELEASE="$(get_last_release)"
  BUMPED_RELEASE="$(bump_release_number "$CURRENT_RELEASE")"
  LAST_GOOD_SHA="$(get_last_good_sha)"
  echo "Current release: $CURRENT_RELEASE"
  echo "Next release: $BUMPED_RELEASE"
  echo "Release branch: pre-release/$BUMPED_RELEASE"
  echo "Good commit: $LAST_GOOD_SHA"
  echo "Good commit message:"
  git log --format=%B -n 1 "$(get_last_good_sha)" | while read -r line; do
    echo ">  $line"
  done
}

promote_to_release() {
  export GITHOOK_NO_VERIFY=true LOCAL_VERSION=true
  # "last" release is the current because it has been created
  RELEASE_VERSION="$(get_last_release)"
  echo "Release $RELEASE_VERSION"
  # Rename pre-release/* branch to release/*
  echo "Renaming pre-release to release (locally)"
  git branch -m "pre-release/${RELEASE_VERSION}" "release/${RELEASE_VERSION}"
  echo "Pushing release branch"
  git push origin "release/${RELEASE_VERSION}" --set-upstream
  echo "Deleting pre-release branch (on remote)"
  git push origin "pre-release/${RELEASE_VERSION}" --delete
  echo "Deleting pre-release branch (locally)"
  git branch -D "pre-release/${RELEASE_VERSION}"
}

release_flows() {
  echo "Release flow path '${ACTION}'"
  describe_release
  case "${ACTION}" in
  branch) create_pre_release_branch ;;
  promote) promote_to_release ;;
  *) echo "Unknown action '${ACTION}'" exit 1 ;;
  esac
}

show_help() {
  echo ""
  echo "Usage: $0 [branch|promote] [options]"
  echo "  -m, --max-minor <number>: Maximum minor version number"
  echo "  -p, --push-release-branch: Push release branch to remote"
  echo "  -i, --ignore-existing-release: Ignore existing release branch"
  echo ""
}

parse_args() {
  local arg
  while [ $# -gt 0 ]; do
    arg="$1"
    # echo "Parsing $arg"
    case "$arg" in
    -m | --max-minor)
      MAX_MINOR="$2"
      shift
      ;;
    -p | --push-release-branch)
      PUSH_RELEASE_BRANCH=true
      ;;
    -i | --ignore-existing-release)
      IGNORE_EXISTING_RELEASE=true
      ;;
    --)
      shift
      break
      ;;
    -h | --help)
      show_help
      exit 1
      ;;
    -*)
      echo "Unknown option: $arg"
      exit 1
      ;;
    *)
      # echo "Setting ACTION to $arg"
      ACTION="$arg"
      ;;
    esac
    shift
  done
}

parse_args "$@"

# Return if script is being sourced
if (return 0 2>/dev/null); then
  echo "Script is being sourced"
  return
fi

release_flows "$@" || show_help
