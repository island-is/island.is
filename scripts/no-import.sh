#!/bin/bash

set -euo pipefail
# set -x

# Define color codes
RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Log function to print messages with color
log() {
  local color="$1"
  local message="$2"
  echo -e "${color}${message}${NC}" >&2
}

# Check initial conditions (filename provided, file exists)
check_initial_conditions() {
  local shouldExit=false

  local filename="${1:-}"
  if [ ! -f "$filename" ]; then
    log "$RED" "Error: File does not exist."
    shouldExit=true
  fi

  local namespace="${2:-}"
  if [ -z "$namespace" ]; then
    log "$RED" "Error: Namespace not provided."
    shouldExit=true
  fi

  if [ "$shouldExit" = true ]; then
    log "$YELLOW" "Usage: $0 <filename> <namespace>"
    exit 1
  fi
}

# Extract the import path for 'm'
extract_import_path() {
  local filename="$1"
  local namespace="$2"
  grep -oPm1 "import { [^}]+ } from '\K${namespace}[^']+" "${filename}"
}

# Resolve the import path using tsconfig
resolve_path() {
  local importPath="$1"
  local tsConfigPath="tsconfig.base.json"
  local aliasGroupPattern='\[[^\]]+\]' #'([^\\]]+]|"[^"]+")'
  local stringPattern='"\K(?!\@)[^"]+(?=")'
  local aliasPath
  aliasMapping="$(
    grep -Pzm1 -o "\"${importPath}\": ${aliasGroupPattern}" "$tsConfigPath"
  )" || true
  log "$GRAY" "aliasMapping='$aliasMapping'"

  aliasPath="$(
    echo "$aliasMapping" | grep -oP "${stringPattern}"
  )" || true
  log "$YELLOW" "aliasPath='$aliasPath'"
  importPath="$aliasPath"

  log "$GRAY" "Searching for alias in $tsConfigPath for '$importPath'..."

  if [ -z "$aliasPath" ]; then
    log "$YELLOW" "No alias found in $tsConfigPath for '$importPath'."
    exit 1
  fi

  local basePath
  basePath=$(dirname "$tsConfigPath")
  log "$BLUE" "Found alias: '$aliasPath'"
  echo "$basePath/$aliasPath"
}

# Process label references within the file
process_labels() {
  local filename="$1"
  local resolvedPath="$2"

  log "$BLUE" "Looking for label(...) references in '$filename'..."
  local references
  references="$(grep -oP 'label\(\K(\w*[mM]essages?\w*|m)\.[^)]+' "$filename")" || true

  if [ -z "$references" ]; then
    log "$YELLOW" "No label references found."
    exit 1
  fi
  log "$GRAY" "Found label references: '${references//$'\n'/, }'"

  echo "$references" | while read -r labelRef; do
    log "$BLUE" "Processing label reference: '$labelRef'"

    local attribute
    attribute=$(echo "$labelRef" | grep -oP '\.\K\w+')
    log "$GRAY" "Extracted attribute: '$attribute'"

    log "$GRAY" "Searching for defaultMessage for '$attribute' in '$resolvedPath'..."

    local defaultMessage
    defaultMessage=$(awk -v attr="$attribute" '
      $0 ~ attr ": {" { capture = 1 }
      capture && /defaultMessage:/ {
          print;
          exit;
      }
      ' "$resolvedPath" | grep -oP 'defaultMessage: \K.*' | sed "s/[\",']//g") || continue

    if [ -z "$defaultMessage" ]; then
      log "$YELLOW" "Warning: defaultMessage for '$labelRef' not found."
    else
      log "$BLUE" "Found defaultMessage: '$defaultMessage'"
      local escapedMessage
      escapedMessage="$(echo "$defaultMessage" | sed 's/[&/\]/\\&/g')" || true
      sed -i "s@label($labelRef)@'${escapedMessage}'@g" "$filename"
      log "$GREEN" "Replaced '$labelRef' with its defaultMessage."
    fi
  done
}

main() {
  local filename="$1"
  local namespace="$2"
  log "$BLUE" "Processing file: $filename"

  local importPath
  importPath=$(extract_import_path "$filename" "$namespace")
  if [ -z "$importPath" ]; then
    log "$YELLOW" "No import statement found for 'm'."
    exit 1
  fi
  log "$BLUE" "Found import path: '$importPath'"

  local resolvedPath
  resolvedPath=$(resolve_path "$importPath")
  log "$BLUE" "Resolved path: '$resolvedPath'"

  process_labels "$filename" "$resolvedPath"

  log "$GREEN" "Processing complete."
}

check_initial_conditions "$@"
main "$@"
