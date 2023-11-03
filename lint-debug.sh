#!/bin/bash

export TIMING=1 NX_SKIP_NX_CACHE=true
logfile="$(mktemp)"
(
  echo "Linting projects"
  echo "Logfile: $logfile"
  for project in $(yarn nx show projects); do
    output="$(yarn nx lint "$project" |& tee -a "$logfile")"
    grep_pattern='^\S+\s+\|\s+\d{3,}'
    if echo "$output" |& grep -P "$grep_pattern"; then
      echo "Project: $project - FAIL"
      echo "$output" | grep ".*$grep_pattern"
    else
      echo "Project: $project - OK"
    fi
  done
)
