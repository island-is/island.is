#!/usr/bin/env bash

APP="$0"
APPDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

usage() {
	echo "Usage: $APP language type [ > template.js ]"
	echo -e "\tlanguage: is|en|..."
	echo -e "\ttype:     slim|full"
}

if [ "$1" == "" ]; then
	echo "Error: missing language"
	usage
	exit 1
fi

if [[ "$2" != "slim" ]] && [[ "$2" != "full" ]]; then
	echo "Error: wrong type: $2"
	usage
	exit 1
fi

TEMPLATE="$APPDIR/../config/template-is.json"

if [ ! -f "$TEMPLATE" ]; then
	echo "Error: could not find template file: '$TEMPLATE'"
	exit 1
fi

JQ="$(which jq)"
if [ ! -x "$JQ" ]; then
	echo "Error: could not find 'jq'. Please install"
	exit 1
fi

replace_slim() {
	sed -E 's@"rules_path":.*?(,?\s*)$@"rules": []\1@' | \
	sed -E 's@"stopwords_path":.*?(,?\s*)$@"stopwords": []\1@' | \
	sed -E 's@"keywords_path":.*?(,?\s*)$@"keywords": []\1@' | \
	sed -E 's@"synonyms_path":.*?(,?\s*)$@"synonyms": []\1@'
}

replace_full() {
	sed -E 's@"rules_path":.*?(,?\s*)$@"rules_path": "analysis/stemmer.txt"\1@' | \
	sed -E 's@"stopwords_path":.*?(,?\s*)$@"stopwords_path": "analysis/stopwords.txt"\1@' | \
	sed -E 's@"keywords_path":.*?(,?\s*)$@"keywords_path": "analysis/keywords.txt"\1@' | \
	sed -E 's@"synonyms_path":.*?(,?\s*)$@"synonyms_path": "analysis/synonyms.txt"\1@'
}

main() {
	# local lang="$1"
	local type="$2"
	local func="replace_$type"

	jq '.settings, .mappings' < "$TEMPLATE" | $func

}

main "$1" "$2"