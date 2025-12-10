#!/bin/bash

# compare-lints.sh
# Compares lint counts between two sets of linting results (head and base).
# Fails if the lint count for any individual file has increased.

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
  # Sum the counts after "#lints: " in the processed file.
  # If the file is empty or no counts, awk will output 0.
  awk -F '#lints: ' '{ sum += $2 } END { print sum + 0 }' "$processed_file"
}

# Calculate total lint counts
BASE_LINT_COUNT=$(get_total_lint_count "$BASE_LINT_PROCESSED_FILE")
HEAD_LINT_COUNT=$(get_total_lint_count "$HEAD_LINT_PROCESSED_FILE")

echo "Base total lint count: $BASE_LINT_COUNT"
echo "Head total lint count: $HEAD_LINT_COUNT"

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
  if [[ ! -v BASE_LINTS["$file"] ]]; then
    # This case explicitly handles files that are new and have lints,
    # even though delta > 0 for base_count=0 covers it.
    delta=$head_count
    CHANGED_FILES_OUTPUT+="  $file (0->$head_count 𝚫+$delta, new)\n"
    FILES_WITH_INCREASED_LINTS=$((FILES_WITH_INCREASED_LINTS + 1))
    TOTAL_INCREASED_LINT_COUNT=$((TOTAL_INCREASED_LINT_COUNT + delta))
  elif ((delta > 0)); then
    CHANGED_FILES_OUTPUT+="  $file ($base_count->$head_count 𝚫+$delta)\n"
    FILES_WITH_INCREASED_LINTS=$((FILES_WITH_INCREASED_LINTS + 1))
    TOTAL_INCREASED_LINT_COUNT=$((TOTAL_INCREASED_LINT_COUNT + delta))
  elif ((delta < 0)); then
    CHANGED_FILES_OUTPUT+="  $file ($base_count->$head_count 𝚫$delta)\n"
  fi
done

# Check for files that were in base but are no longer in head (lints removed entirely)
for file in "${!BASE_LINTS[@]}"; do
  if [[ ! -v HEAD_LINTS["$file"] ]]; then
    delta="${BASE_LINTS[$file]}"
    base_count=$delta
    CHANGED_FILES_OUTPUT+="  $file ($base_count->0 𝚫-$delta, cleaned)\n"
  fi
done

COUNT_DIFF=$((HEAD_LINT_COUNT - BASE_LINT_COUNT))

if ((TOTAL_INCREASED_LINT_COUNT == 0)); then
  echo "Lint count has not increased per file (Total lint delta: $BASE_LINT_COUNT->$HEAD_LINT_COUNT, 𝚫=$COUNT_DIFF)"
  if [[ -n "$CHANGED_FILES_OUTPUT" ]]; then
    echo "Files with changed lints:"
    echo -e "$CHANGED_FILES_OUTPUT"
  fi
  exit 0
else
  echo "::error title=LINT_INCREASE::Please fix your lints 🙏 (found $FILES_WITH_INCREASED_LINTS files with increased lints, total increase of $TOTAL_INCREASED_LINT_COUNT lints)"
  echo "Files with changed lints or new lints:"
  echo -e "$CHANGED_FILES_OUTPUT"
  echo "::group::Full lint diff"
  diff "$BASE_LINT_PROCESSED_FILE" "$HEAD_LINT_PROCESSED_FILE" || true
  echo "::endgroup::"
  exit 1
fi
