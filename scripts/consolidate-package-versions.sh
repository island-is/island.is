#!/bin/bash
set -euo pipefail
if [[ -z "${VERSION:-}" ]]; then
  VERSION="$1"
  shift
fi
VERSION="${VERSION:-1}"
PACKAGES="@"
PACKAGES_VERSIONED=()
# Make sure packages are present and in correct version
for package in "${PACKAGES[@]}"; do
  package_versioned="$package@$VERSION"
  echo "Adding $package_versioned"
  PACKAGES_VERSIONED+=("$package_versioned")
done
echo "Adding packages (${PACKAGES_VERSIONED[*]})"
yarn add "${PACKAGES_VERSIONED[@]}"

# Set major.minor.patch using 'yarn info'
PACKAGES_PINNED=()
for package in "${PACKAGES[@]}"; do
  echo "Setting version for $package"
  PACKAGES_PINNED+=("$package@$(yarn info "$package" --json | jq -r '.children.Version')")
done
echo "Adding pinned packages (${PACKAGES_PINNED[*]})"
yarn add "${PACKAGES_PINNED[@]}"
