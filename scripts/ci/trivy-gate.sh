#!/usr/bin/env bash
# Fail on Trivy findings in JSON reports:
#   secrets and CRITICAL misconfig: always
#   vulnerabilities: severities in TRIVY_FAIL_ON (e.g. CRITICAL), off if unset
# usage: trivy-gate.sh <report.json>...
set -euo pipefail

FAIL_ON=${TRIVY_FAIL_ON:-}
status=0

for report in "$@"; do
  [ -s "$report" ] || continue
  # One line per blocking finding: "<kind> <id> <target>".
  hits=$(jq -r --arg f "$FAIL_ON" '
    ($f | ascii_upcase | split(",") | map(select(. != ""))) as $sev
    | (.ArtifactName | split("/") | last) as $a
    | .Results[]? | .Target as $t
    | ((.Secrets // [])[] | "secret \(.RuleID) \($a) \($t):\(.StartLine)"),
      ((.Misconfigurations // [])[]
        | select(.Status == "FAIL" and .Severity == "CRITICAL")
        | "misconfig \(.ID) \($a) \($t)"),
      ((.Vulnerabilities // [])[]
        | select(.Severity as $s | $sev | index($s))
        | "vuln \(.VulnerabilityID) \($a) \(.PkgName)@\(.InstalledVersion)")
  ' "$report")
  if [ -n "$hits" ]; then
    while read -r kind id rest; do
      echo "::error title=Trivy ${kind}::${id} ${rest}"
    done <<< "$hits"
    status=1
  fi
done

exit "$status"
