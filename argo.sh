#!/bin/bash


function get_affected() {
  affected_apps=$(nx print-affected --base=main --head=HEAD --select=projects --type=app)

  echo "[" > affected.json

  for app in $affected_apps; do
    echo "{ \"appName\": \"$app\", \"prNumber\": \"$PR_NUMBER\" }," >> affected.json
  done

  echo "]" >> affected.json
}

function update_tag() {
  # git clone argo-config repo
  yq eval ".spec.template.spec.source.helm.parameters[] |= select(.name == \"applicationsTag\").value = \"$APPLICATION_TAG\"" appset.yaml -i

  # This would be done in the identityserver.web pipeline
  yq eval ".spec.template.spec.source.helm.parameters[] |= select(.name == \"idsTag\").value = \"$IDS_TAG\"" appset.yaml -i
  # git commit and push to argo-config repo
}