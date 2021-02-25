#!/bin/bash
#
# Provide environment variables for static frontends by checking referenced
# variables in the code and inject them into index.html
#

set -e

work_dir="/usr/share/nginx/html"
file="$work_dir/index.html"

script_start="<script id=\"environment\" type=\"application\/json\">"
script_end="<\/script>"
placeholder="$script_start.*$script_end"

function extract_environment() {
  environment="{}"
  env_names=$(grep -ohr "window\.ENV\.\w*" "$work_dir/" | cut -d '.' -f3 | sort | uniq)

  for env_name in $env_names; do
    env_value=${!env_name}

    if [[ ! -z "$env_value" ]]; then
      environment=$(echo $environment | jq -Mc ". + {\"$env_name\": \"$env_value\"}")
    fi
  done

  echo $environment
}

function find_placeholder() {
  echo $(grep "$placeholder" "$file")
}

function insert_environment() {
  environment="$1"

  escaped_environment=$(echo "$environment" | sed -e 's/[\/&]/\\&/g')
  script="$script_start window.ENV = $escaped_environment $script_end"

  sed -i "s/$placeholder/$script/g" "$file"
}

function main() {
  has_placeholder=$(find_placeholder)
  if [[ ! -z "$has_placeholder" ]]; then
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
