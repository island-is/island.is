#!/bin/bash
set -euo pipefail
# set -x

: "${SPINNAKER_ID:=}"
: "${IMAGES:=}"
: "${OUT_DIR:=/tmp/spinnaker-diff}"

show_usage() {
  cat <<EOF
Usage: $0 [options]
  --id SPINNAKER_ID
  --images IMAGES
  --out DIR
EOF
}

default_images() {
  if [ -z "$IMAGES" ]; then
    # Check if spinnaker-*.json exists
    if ! (
      for f in spinnaker-*.json; do
        if [[ -f "$f" ]]; then
          echo "Found spinnaker-*.json: $f"
          exit 0
        fi
      done
      echo "No spinnaker-*.json found"
      exit 1
    ); then
      echo "No spinnaker-*.json present. Please download in your browser at https://spinnaker-gate.shared.devland.is/pipelines/<SPINNAKER_ID>"
      echo "  and save it as spinnaker-<SPINNAKER_ID>.json"
    else
      IMAGES="$(cat spinnaker-*.json | jq '.stages[5].context.manifest.spec.template.spec.containers[0].command[6]')"
    fi
  fi
}

parse_cli() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    --id | --spinnaker-id)
      SPINNAKER_ID="$2"
      shift
      shift
      ;;
    --images)
      IMAGES="$2"
      shift
      shift
      ;;
    --out | --out-dir)
      OUT_DIR="$2"
      shift
      shift
      ;;
    -h | --help)
      show_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      shift
      ;;
    esac
  done
  default_images
}

prepare() {
  mkdir -p "$OUT_DIR"
  if [ -z "$SPINNAKER_ID" ]; then
    echo -n "Enter Spinaker ID: "
    read -r SPINNAKER_ID
  fi
}

generate() {
  echo "Fetching generated values from s3 (ID=$SPINNAKER_ID)"
  aws s3 cp "s3://shared-spinnaker-artifacts-island-is/feature-deployment/${SPINNAKER_ID}-values.yaml" "$OUT_DIR/sugb-values.s3-$SPINNAKER_ID.yaml"

  for images in "star:*" "list:$IMAGES"; do
    tag="${images/:*/}"
    images="$OUT_DIR/${images/*:/}"
    f="$OUT_DIR/sugb-values.local-$tag.yaml"
    echo "Generating images for $tag to $f"
    echo "feature-env-images: $images" >"$f"
    podman run helm values --feature university-gateway --images "$images" --chart islandis --withMocks false >>"$f"
  done
}

interact() {
  echo "Now run 'nvim -Rd sugb-values.*.yaml'"
  echo -n "Run now? [y/N] "
  REPLY=n
  if read -r -t 3 REPLY && [ "${REPLY,,}" = "y" ]; then
    nvim -Rd "$OUT_DIR"/sugb-values.*.yaml
  fi
}
main() {
  parse_cli "$@"
  prepare
  generate
  interact
}

main "$@"
echo "Done"
