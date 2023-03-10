#!/bin/bash

set -euo pipefail

env=${1:-dev}
project_root=$(git rev-parse --show-toplevel)
export_dir="${project_root}/tmp"
content_file="contentful-data.json"
contentful_config="${project_root}/scripts/config/contentful-config.json"
s3_bucket="${env}-island-is-contentful-data-export"

function get_param() {
  local name=$1
  aws ssm get-parameter --name "$name" --with-decryption | jq -r '.Parameter.Value'
}

function contentful_export() {
# FIXME: incorrect space-id in ssm
# --space-id "$(get_param "/k8s/api-catalogue/CONTENTFUL_SPACE_ID")"
  mkdir -p "${export_dir}"
  contentful space export \
    --config "$contentful_config" \
    --mt "$(get_param "/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN")" \
    --space-id "8k0h54kbe6bj" \
    --export-dir "${export_dir}" \
    --content-file "${content_file}"

}

function s3_copy() {
  aws s3 cp "${export_dir}/${content_file}" "s3://${s3_bucket}/"
}

contentful_export
s3_copy
rm "${export_dir}/${content_file}"