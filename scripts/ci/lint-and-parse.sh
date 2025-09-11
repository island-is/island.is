#!/bin/bash

# lint-and-parse.sh
# This script runs Nx lint for specified projects, captures the raw output,
# strips ANSI escape codes, and then processes it to generate a file with
# each linted file and its lint count.

# Usage: ./lint-and-parse.sh <AFFECTED_PROJECTS> <FILE_PATH>
# <AFFECTED_PROJECTS>: Comma-separated list of Nx projects to lint.
# <FILE_PATH>: Filename of the processed lints

set -euo pipefail

AFFECTED_PROJECTS="$1"
LINT_NAME="${LINT_NAME:-$(git log --format='%h' -n1)}"
FILE_PATH="${2:-dist/lints-processed-${LINT_NAME}.txt}"
[[ $# -le 2 ]] || {
  echo "Max 2 args, you passed: $# ($*)"
  exit 1
}

# Ensure the output directory exists
mkdir -p "$(dirname "$FILE_PATH")" || :

LINT_RAW_FILE="${FILE_PATH}.raw"
LINT_PROCESSED_FILE="${FILE_PATH}"

echo "Running lint for projects: $AFFECTED_PROJECTS (stripping colors)"
echo "Raw lint output will be saved to: $LINT_RAW_FILE"
echo "Processed lint output will be saved to: $LINT_PROCESSED_FILE"

# Run nx lint, pipe output through sed to strip ANSI escape codes, then tee to a raw file
yarn nx run-many -t lint --output-style=static --projects "$AFFECTED_PROJECTS" |
  sed -E "s/\x1B\[[0-9;]*[mK]//g" |
  sed 's/\r$//' |
  tee "$LINT_RAW_FILE"

# Process the raw lint output to get lint counts per file
# This awk script iterates through the lines:
# - If a line looks like a file path, it stores it and resets the counter.
# - If a line looks like a lint warning/error (contains :LINE:COL warning/error), it increments the counter.
# - When a new file path is found or at the end of the file, it prints the previous file's total.
awk '
  # This regex matches a line that starts with a /, followed by non-colon characters,
  # then a period, then more characters. It aims to capture the file path line.
  /^\/[^:]+\.[^:]+$/ {
    if (current_file != "" && lint_count > 0) {
      print current_file " #lints: " lint_count
    }
    current_file = $0
    lint_count = 0
    next
  }
  # This regex matches lines that start with spaces, then digits:digits (line:col),
  # then "warning" or "error". This identifies actual lint problem lines.
  /^[[:space:]]*[0-9]+:[0-9]+[[:space:]]+(warning|error)/ {
    lint_count++
  }
  END {
    # Print the last file;s count if there was one
    if (current_file != "" && lint_count > 0) {
      print current_file " #lints: " lint_count
    }
  }
' "$LINT_RAW_FILE" | sort >"$LINT_PROCESSED_FILE"

echo "Lint parsing complete."
echo "Processed lints written to: $LINT_PROCESSED_FILE"
