#!/bin/bash

# compare-lints.sh
# Compares lint counts between two sets of linting results (head and base).
# It checks for new files with lints and for an increase in the total lint count
# or an increase in lint count for any individual file.

# Usage: ./compare-lints.sh <BASE_LINT_PROCESSED_FILE> <HEAD_LINT_PROCESSED_FILE>

set -euo pipefail

BASE_LINT_PROCESSED_FILE="$1"
HEAD_LINT_PROCESSED_FILE="$2"

echo "Comparing lint results..."
echo "Base processed file: $BASE_LINT_PROCESSED_FILE"
echo "Head processed file: $HEAD_LINT_PROCESSED_FILE"

# Function to calculate total lints from a processed file
get_total_lint_count() {
  local processed_file="$1"
  # Sum the counts after "#lints: " in the processed file
  # If the file is empty or no counts, awk will output 0.
  awk -F '#lints: ' '{ sum += $2 } END { print sum + 0 }' "$processed_file"
}

# Calculate total lint counts
BASE_LINT_COUNT=$(get_total_lint_count "$BASE_LINT_PROCESSED_FILE")
HEAD_LINT_COUNT=$(get_total_lint_count "$HEAD_LINT_PROCESSED_FILE")

# echo "Base total lint count: $BASE_LINT_COUNT"
# echo "Head total lint count: $HEAD_LINT_COUNT"

# Parse lint counts into associative arrays
declare -A BASE_LINTS
while IFS=' ' read -r file _ count; do
  BASE_LINTS["$file"]="$count"
done <"$BASE_LINT_PROCESSED_FILE"

declare -A HEAD_LINTS
while IFS=' ' read -r file _ count; do
  HEAD_LINTS["$file"]="$count"
done <"$HEAD_LINT_PROCESSED_FILE"

CHANGED_FILES_OUTPUT=""
FILES_WITH_INCREASED_LINTS=0
TOTAL_INCREASED_LINT_COUNT=0

# Check for new files, increased lints in existing files, and decreased lints
for file in "${!HEAD_LINTS[@]}"; do
  head_count="${HEAD_LINTS[$file]}"
  base_count="${BASE_LINTS[$file]:-0}" # Default to 0 if file not in base

  delta=$((head_count - base_count))
  if ((delta > 0)); then
    CHANGED_FILES_OUTPUT+="  $file ($head_count->$base_count 𝚫+$delta)\n"
    FILES_WITH_INCREASED_LINTS=$((FILES_WITH_INCREASED_LINTS + 1))
    TOTAL_INCREASED_LINT_COUNT=$((TOTAL_INCREASED_LINT_COUNT + delta))
  elif ((delta < 0)); then
    CHANGED_FILES_OUTPUT+="  $file ($head_count->$base_count 𝚫$delta)\n"
  elif [[ ! -v BASE_LINTS["$file"] ]]; then # New file with lints
    delta=$head_count
    CHANGED_FILES_OUTPUT+="  $file ($head_count->$base_count 𝚫+$delta)\n"
    FILES_WITH_INCREASED_LINTS=$((FILES_WITH_INCREASED_LINTS + 1))
    TOTAL_INCREASED_LINT_COUNT=$((TOTAL_INCREASED_LINT_COUNT + delta))
  fi
done

# Check for files that were in base but are no longer in head (lints removed entirely)
for file in "${!BASE_LINTS[@]}"; do
  if [[ ! -v HEAD_LINTS["$file"] ]]; then
    delta="${BASE_LINTS[$file]}"
    CHANGED_FILES_OUTPUT+="  $file ($((delta))->0, 𝚫-$delta, clean)\n"
  fi
done

COUNT_DIFF=$((HEAD_LINT_COUNT - BASE_LINT_COUNT))

if ((TOTAL_INCREASED_LINT_COUNT == 0)); then
  echo "Lint count has not increased ($HEAD_LINT_COUNT->$BASE_LINT_COUNT, 𝚫=$COUNT_DIFF)"
  if [[ -n "$CHANGED_FILES_OUTPUT" ]]; then
    echo "Files with changed lints:"
    echo -e "$CHANGED_FILES_OUTPUT"
  fi
  exit 0
else
  echo "::error title=LINT_INCREASE::Please fix your lints 🙏 (found $FILES_WITH_INCREASED_LINTS files with increased lints, total increase of $TOTAL_INCREASED_LINT_COUNT lints)"
  echo "Files with changed lints or new lints:"
  echo -e "$CHANGED_FILES_OUTPUT" # Print the actual output
  echo "::group::Full lint diff"
  # Use diff to show precise changes between the processed files
  diff "$BASE_LINT_PROCESSED_FILE" "$HEAD_LINT_PROCESSED_FILE" || true # || true to ignore diff exit code (diff exits 1 if files differ)
  echo "::endgroup::"
  exit 1
fi
