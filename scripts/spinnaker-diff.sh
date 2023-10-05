#!/bin/bash
set -euo pipefail
# set -x

: "${SPINNAKER_ID:=<SPINNAKER_ID>}"
: "${IMAGES:=}"
: "${OUT_DIR:=/tmp/spinnaker-diff}"
: "${SPINNAKER_BASE_URL:=https://spinnaker-gate.shared.devland.is/pipelines}"

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
    echo "No IMAGES specified!"
    if ! (
      for f in "$OUT_DIR"/spinnaker-*.json; do
        if [[ -f "$f" ]]; then
          echo "Found spinnaker-*.json: $f"
          exit 0
        fi
      done
      exit 1
    ); then
      echo "No $OUT_DIR/spinnaker-*.json present. Please open your browser and download at $SPINNAKER_BASE_URL/$SPINNAKER_ID"
      echo "  and save it as spinnaker-$SPINNAKER_ID.json"
      if [[ "$SPINNAKER_ID" == "<SPINNAKER_ID>" ]]; then return; fi
      # if ! command -v xdg-open >/dev/null 2>&1; then return; fi
      echo -n "Open browser on download page? [y/N] "
      REPLY=n
      if read -r -t 10 REPLY && [ "${REPLY,,}" = "y" ]; then
        for browser in firefox chrome; do
          if ! command -v "$browser" >/dev/null 2>&1; then continue; fi
          # xdg-open
          "$browser" "$SPINNAKER_BASE_URL/$SPINNAKER_ID" || continue
          echo -n "Press any key to continue"
          for i in {1..30}; do
            echo -n "${i/*/.}"
            if [[ -f "$HOME/Downloads/${SPINNAKER_ID}.json" ]]; then
              echo ""
              echo "Found $HOME/Downloads/${SPINNAKER_ID}.json"
              break
            fi
            if read -r -n 1 -t 1 REPLY; then
              echo "Continuing..."
              break
            fi
            if [[ $i -eq 30 ]]; then
              echo ""
              echo "Timed out"
              break
            fi
          done
          src="$HOME/Downloads/${SPINNAKER_ID}.json"
          if mv "$src" "$OUT_DIR/spinnaker-$SPINNAKER_ID.json" 2>/dev/null; then
            echo "Moved $HOME/Downloads/${SPINNAKER_ID}.json to $OUT_DIR/spinnaker-$SPINNAKER_ID.json"
          elif ! [[ -f "src" ]]; then
            echo "No $HOME/Downloads/${SPINNAKER_ID}.json present, continuing without spinnaker job file"
          else
            echo "Failed to move $HOME/Downloads/${SPINNAKER_ID}.json to $OUT_DIR/spinnaker-$SPINNAKER_ID.json"
          fi

        done
      fi
    else
      IMAGES="$(cat "$OUT_DIR"/spinnaker-*.json | jq '.stages[5].context.manifest.spec.template.spec.containers[0].command[6]')"
    fi
  fi
  # echo "IMAGES: $IMAGES"
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
  if ! aws s3 cp "s3://shared-spinnaker-artifacts-island-is/feature-deployment/${SPINNAKER_ID}-values.yaml" "$OUT_DIR/sugb-values.s3-$SPINNAKER_ID.yaml"; then
    echo "Failed to fetching generated values from s3"
  fi

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
  if read -r -t 10 REPLY && [ "${REPLY,,}" = "y" ]; then
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
