#!/bin/sh

usage() {
  exitcode="$1"
  cat << USAGE >&2
Usage:
  _run-tests.sh app [--runner runner]
  --runner=runner   The name of the runner
USAGE
  exit "$exitcode"
}

APP="$1"
shift 1

RUNNER=""

while [ $# -gt 0 ]
do
  case "$1" in
    --runner)
    RUNNER="$2"
    shift 2
    ;;
    --help)
    usage 0
    ;;
    *)
    echo "Unknown argument: $1"
    usage 1
    ;;
  esac
done

if [ "$RUNNER" = "" ]; then
  yarn test $APP --runInBand --codeCoverage
else
  yarn test $APP --runInBand --runner="$RUNNER" --codeCoverage
fi

NODE_OPTIONS="" codecov --flags "$APP" --dir coverage/
rm -rf coverage/
