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

echo "| Artifact | Target | Type | Critical | High | Other |"
echo "|---|---|---|---|---|---|"
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
    | (.f | n("CRITICAL")) as $c | (.f | n("HIGH")) as $h
    | "| `\($a)` | `\(.t)` | \(.c) | \($c) | \($h) | \((.f | length) - $c - $h) |"
  ' "$report"
done
echo
echo "CVEs: fixable only. Config: trivy.yaml, .trivyignore.yaml."
