#!/bin/bash
#
# Provide environment variables for static frontends by checking referenced
# variables in the code and inject them into index.html
#

set -e

work_dir="${1:-/usr/share/nginx/html}"
file="$work_dir/index.html"

placeholder="<!-- environment placeholder -->"

function extract_environment() {
  env_prefix="SI_PUBLIC_"
  environment="{}"
  env_names=$(grep -ohr "$env_prefix\w*" "$work_dir/" | sort | uniq)

  for env_name in $env_names; do
    env_value=${!env_name}

    if [[ -n "$env_value" ]]; then
      environment=$(echo $environment | jq -Mc ". + {\"$env_name\": \"$env_value\"}")
    fi
  done

  echo "$environment"
}

function find_placeholder() {
  [[ -f "$file" ]] && grep "$placeholder" "$file"
}

function insert_environment() {
  environment="$1"

  script_start="<script id=\"__SI_ENVIRONMENT__\" type=\"application\/json\">"
  script_end="<\/script>"
  escaped_environment=$(echo "$environment" | sed -e 's/[\/&]/\\&/g')
  script="$script_start $escaped_environment $script_end"

  sed -i "s/$placeholder/$script/g" "$file"
}

function main() {
  if find_placeholder; then
    echo "Extracting environment"
    environment=$(extract_environment)

    environment_length=$(echo "$environment" | jq length)
    echo "Inserting environment with $environment_length keys to $file"
    insert_environment "$environment"
  else
    echo "File $file does not have env placeholder $placeholder"
  fi
}

main "$@"
