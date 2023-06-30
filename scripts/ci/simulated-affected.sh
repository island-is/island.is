#!/bin/bash

# Default search directories
apps_dir="./apps"
libs_dir="./libs"

# Default number of "src" directories to search
num_dirs=0

# Function to create the deleteme.ts file in a given directory
create_deleteme_file() {
  local dir="$1"
  echo 'console.log("this file should be deleted");' > "${dir}/deleteme.ts"
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --apps)
      # Search only in the ./apps directory
      search_dirs=("$apps_dir")
      shift
      ;;
    --libs)
      # Search only in the ./libs directory
      search_dirs=("$libs_dir")
      shift
      ;;
    --all)
      # Search in both ./apps and ./libs directories
      search_dirs=("$apps_dir" "$libs_dir")
      shift
      ;;
    --num-dirs)
      # Specify the number of src directories to search
      if [[ $# -lt 2 || ! $2 =~ ^[0-9]+$ ]]; then
        echo "Please provide a valid number with the --num-dirs flag."
        exit 1
      fi
      num_dirs=$2
      shift 2
      ;;
    *)
      echo "Invalid argument: $1"
      exit 1
      ;;
  esac
done

# Check if search directories are specified
if [[ ${#search_dirs[@]} -eq 0 ]]; then
  echo "Please provide a valid flag: --apps, --libs, or --all"
  exit 1
fi

# Find and create the deleteme.ts file in the specified directories
for dir in "${search_dirs[@]}"; do
  find "$dir" -type d -name "src" | head -n "$num_dirs" | while read -r src_dir; do
    create_deleteme_file "$src_dir"
  done
done
