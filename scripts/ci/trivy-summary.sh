#!/usr/bin/env bash
# Markdown table of Trivy JSON reports: findings per target.
# usage: trivy-summary.sh <title> <report.json>...
set -euo pipefail

title=$1
shift

echo "### Trivy: $title"
if [ "$#" -eq 0 ]; then
  echo "No reports."
  exit 0
fi

echo "| Artifact | Target | Type | Critical | High |"
echo "|---|---|---|---|---|"
for report in "$@"; do
  [ -s "$report" ] || continue
  jq -r '
    def n(s): [.[] | select(.Severity == s)] | length;
    (.ArtifactName | split("/") | last) as $a
    | .Results[]?
    | {t: .Target, c: .Class,
       f: ((.Vulnerabilities // []) + (.Secrets // [])
           + [(.Misconfigurations // [])[] | select(.Status == "FAIL")])}
    | select(.f | length > 0)
    | "| `\($a)` | `\(.t)` | \(.c) | \(.f | n("CRITICAL")) | \(.f | n("HIGH")) |"
  ' "$report"
done
echo
echo "HIGH/CRITICAL with a fix only. Config: trivy.yaml, .trivyignore.yaml."
