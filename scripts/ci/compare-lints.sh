#!/bin/bash

# compare-lints.sh
# Compares lint counts between two sets of linting results (head and base).
# It checks for new files with lints and for an increase in the total lint count.

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

echo "Base total lint count: $BASE_LINT_COUNT"
echo "Head total lint count: $HEAD_LINT_COUNT"

# Use comm to find lines unique to the HEAD (new lints or changed counts)
# comm -13 suppresses lines unique to file1 and lines common to both files.
# This leaves only lines unique to file2 (HEAD).
# The || true is crucial to prevent the script from exiting if comm returns 1 (no common lines).
NEW_LINT_FILES_OUTPUT=$(comm -13 "$BASE_LINT_PROCESSED_FILE" "$HEAD_LINT_PROCESSED_FILE" || true)

# Count non-empty lines in the output. This is more robust than wc -l for empty/newline-only output.
# grep -c . counts lines that contain at least one character.
# || echo 0 ensures NEW_FILES_WITH_LINTS is 0 if grep finds nothing.
NEW_FILES_WITH_LINTS=$(echo "$NEW_LINT_FILES_OUTPUT" | grep -c . || true)

COUNT_DIFF=$((HEAD_LINT_COUNT - BASE_LINT_COUNT)) || :

if ((NEW_FILES_WITH_LINTS == 0)) && ((COUNT_DIFF <= 0)); then
  echo "Lint count has not increased (𝚫=$COUNT_DIFF)"
  exit 0
else
  echo "::error title=NEW_LINTS::Please fix your lints 🙏 (found $NEW_FILES_WITH_LINTS additional files with lints or an increase of $COUNT_DIFF total lints)"
  echo "Files with changed lints or new lints:"
  echo "$NEW_LINT_FILES_OUTPUT" # Print the actual output from comm
  echo "::group::Full lint diff"
  # Use diff to show precise changes between the processed files
  diff "$BASE_LINT_PROCESSED_FILE" "$HEAD_LINT_PROCESSED_FILE" || true # || true to ignore diff exit code (diff exits 1 if files differ)
  echo "::endgroup::"
  exit 1
fi
