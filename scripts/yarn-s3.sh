#!/bin/bash

set -euox pipefail

YARN_LOCK_SHA=$1
CACHE_MOUNT="${2:-/mnt/cache}"
CACHE_TYPE="${3:-full}" # 'full' or 'minimal'
ARCHIVE_NAME="yarn-cache-${YARN_LOCK_SHA}-${CACHE_TYPE}.zst"
ARCHIVE_PATH="${CACHE_MOUNT}/${ARCHIVE_NAME}"

export YARN_ENABLE_HARDENED_MODE=0

# Function to acquire a lock
acquire_lock() {
  local lock_file="${CACHE_MOUNT}/.cache-lock"
  local max_retries=30
  local retry=0

  mkdir -p "$(dirname "${lock_file}")"

  while ! mkdir "${lock_file}" 2>/dev/null && [ $retry -lt $max_retries ]; do
    echo "Waiting for lock... (attempt $((retry + 1)))"
    sleep 1
    retry=$((retry + 1))
  done
  if [ $retry -eq $max_retries ]; then
    echo "Failed to acquire lock" >&2
    exit 1
  fi
  echo "Lock acquired"
}

# Function to release the lock
release_lock() {
  local lock_file="${CACHE_MOUNT}/.cache-lock"
  if [ -d "${lock_file}" ]; then
    if rmdir "${lock_file}"; then
      echo "Lock released"
    else
      echo "Failed to release lock" >&2
      return 1
    fi
  else
    echo "Lock directory not found, no need to release"
  fi
}

# Ensure cache mount directory exists
mkdir -p "${CACHE_MOUNT}"

# Define cache contents based on cache type
if [ "$CACHE_TYPE" = "full" ]; then
  CACHE_CONTENTS=("node_modules" ".yarn/cache" ".yarn/install-state.gz")
else
  CACHE_CONTENTS=(".yarn/cache" ".yarn/install-state.gz")
fi

# Check if the cache archive exists
if [ -f "${ARCHIVE_PATH}" ] && [ -s "${ARCHIVE_PATH}" ]; then
  echo "Cache found. Extracting..."
  if zstd -d "${ARCHIVE_PATH}" --stdout | tar -xf -; then
    if [ "$CACHE_TYPE" = "minimal" ]; then
      yarn install --immutable
    else
      yarn install --immutable
    fi
  else
    echo "Failed to extract cache archive" >&2
    exit 1
  fi
else
  echo "Cache not found or empty. Running full install..."
  yarn install --immutable

  echo "Creating cache archive..."
  acquire_lock

  # Check if all cache contents exist before creating the archive
  for item in "${CACHE_CONTENTS[@]}"; do
    if [ ! -e "$item" ]; then
      echo "Warning: $item does not exist, skipping cache creation"
      release_lock
      exit 0
    fi
  done

  if tar -cf - "${CACHE_CONTENTS[@]}" | zstd -T0 -3 >"${ARCHIVE_PATH}"; then
    echo "Cache archive created successfully. Size: $(du -h "${ARCHIVE_PATH}" | cut -f1)"
  else
    echo "Failed to create cache archive" >&2
    release_lock
    exit 1
  fi
  release_lock
fi

echo "Cache operation completed successfully."
