#!/usr/bin/env bash
set -euxo pipefail

ES_INDEX_MAIN="${ELASTIC_INDEX:-island-is}"
ES_DOMAIN="${ES_DOMAIN:-search}"
CODE_TEMPLATE="${CODE_TEMPLATE:-/webapp/config/template-is.json}"
GITHUB_DICT_REPO="${GITHUB_DICT_REPO:-https://api.github.com/repos/island-is/elasticsearch-dictionaries}"
S3_BUCKET="${S3_BUCKET:-prod-es-custom-packages}"
S3_FOLDER="${S3_FOLDER:-}"
AWS_BIN=aws

INDEX_FORMAT="island-is-v%d"
TEMPLATE_NAME="template-is"

# Strip trailing slash
S3_FOLDER=${S3_FOLDER%/}

if [ "$ELASTIC_NODE" == "" ]; then
	echo "Error: No ELASTIC_NODE defined"
	exit 1
fi

# Strip trailing slash
ELASTIC_NODE=${ELASTIC_NODE%/}

migrate_dictionary() {
	# version will have a leading "+" if updated is needed
	local version=$(get_next_dictionary_version)
	local needsUpdate=${version:0:1}
	# strip potentional leading "+"
	version="${version#+}"

	if [ "$needsUpdate" == "+" ]; then
		do_dict_update "$version"
	fi
	echo "$version"
}

do_dict_update() {
	local version="$1"
	local dir=$(mktemp -d)
	local url=$(get_dictionary_release_url)
	local file="archive.tar.gz"

	cd "$dir"
	curl --fail -Ls --output $file "$url"
	tar xf $file
	rm $file

	set +f
	# shellcheck disable=SC2035
	cd *
	for f in ??/*; do
		push_package "$version" "$f"
	done
	set -f
}

push_package() {
	local version="$1"
	local full_file="$2"
	# shellcheck disable=SC2206
	local parts=(${full_file//\// })
	local lang="${parts[0]}"

	push_to_s3 "$lang" "$full_file"
	create_package "$version" "$lang" "$full_file"
}

create_package() {
	local version="$1"
	local lang="$2"
	local file="$(basename "$3")"

	local package_name=$(get_package_name "$version" "$lang" "$file")
	local package_type="TXT-DICTIONARY"

	local out=$($AWS_BIN es create-package --package-name "$package_name" --package-type "$package_type" --package-source "S3BucketName=$S3_BUCKET,S3Key=$S3_FOLDER$lang/$file")

	local package_id=$(echo "$out" | jq -r '.PackageDetails.PackageID')

	$AWS_BIN es associate-package --package-id "$package_id" --domain-name "$ES_DOMAIN" >/dev/null

	wait_until_associated "$package_id"
}

wait_until_associated() {
	local package_id="$1"
	local delay=5

	while true; do
		status=$(get_package_status "$package_id")
		if [ "$status" != "ASSOCIATING" ]; then
			break
		fi
		sleep $delay
	done
}

get_package_status() {
	local package_id="$1"

	$AWS_BIN es list-domains-for-package --package-id "$package_id" | jq -r '.DomainPackageDetailsList[0].DomainPackageStatus'
}

get_package_name() {
	local version="$1"
	local lang="$2"
	# Strip extension
	local file="${3/.*/}"

	echo "$lang-$file-$version"
}

get_package_version_from_name() {
	# Can return empty to mark as not found
	local package_name="$1"

	if [[ ! "$package_name" =~ ^[a-z-]+-[0-9]+$ ]]; then
		echo ""
		return
	fi

	echo "${package_name//*-/}"
}

push_to_s3() {
	local lang="$1"
	local file="$(realpath "$2")"

	$AWS_BIN s3 cp --quiet "$file" "s3://$S3_BUCKET$S3_FOLDER/$lang/"
}

get_dictionary_release_url() {
	curl --fail -s "$GITHUB_DICT_REPO/releases/latest" | jq -r '.tarball_url'
}

get_dictionary_latest_version() {
	curl --fail -s "$GITHUB_DICT_REPO/releases/latest" | jq -r '.tag_name'
}

get_next_dictionary_version() {
	# Return the needed/current version. Prefix with '+' if update is needed

	local repo_version="$(get_dictionary_latest_version)"
	# Just pick the stemmer as an example to find version
	local stemmer=$(get_all_es_packages | jq -r '.DomainPackageDetailsList[]|select(.DomainPackageStatus=="ACTIVE")|.PackageName' | grep stemmer | sort -r | head -n 1)
	local es_version=$(get_package_version_from_name "$stemmer")
	local updateNeeded=""

	if [[ "$es_version" == "" ]] || [[ "$es_version" -lt "$repo_version" ]]; then
		updateNeeded="+"
	fi
	echo "$updateNeeded$repo_version"
}

get_all_es_packages() {
	$AWS_BIN es list-packages-for-domain --domain-name "$ES_DOMAIN"
}

push_new_config_template() {
	local dict_version="$1"
	local tmp=$(mktemp)
	generate_config "$dict_version" "$tmp"

	curl --fail -XPUT "$ELASTIC_NODE/_template/$TEMPLATE_NAME" -H 'Content-Type: application/json' -d @"$tmp"
}

reindex_to_new_index() {
	local code_version="$1"
	local old_version=$((code_version - 1))
	local old_name=$(get_index_name "$old_version")
	local new_name=$(get_index_name "$code_version")
	local request='{
	"source": {
		"index": "OLD"
	},
	"dest": {
		"index": "NEW"
	}
}'

	if [ "$old_version" == "0" ]; then
		if ! has_index_version "$code_version"; then
			create_new_index "$new_name"
			return
		fi
	fi

	request=${request//OLD/$old_name}
	request=${request//NEW/$new_name}
	curl --fail -XPOST "$ELASTIC_NODE/_reindex" -H 'Content-Type: application/json' -d "$request"

	switch_alias "$old_name" "$new_name"
}

create_new_index() {
	local index_name="$1"
	curl --fail -XPUT "$ELASTIC_NODE/$index_name" -H 'Content-Type: application/json'
	local request='{
	"actions": [
	  { "add": { "index": "NEW", "alias": "MAIN" } }
	]
}'

	request=${request//NEW/$index_name}
	request=${request//MAIN/$ES_INDEX_MAIN}

	curl --fail -XPOST "$ELASTIC_NODE/_aliases" -H 'Content-Type: application/json' -d "$request"
}

switch_alias() {
	local old_name="$1"
	local new_name="$2"

	local request='{
	"actions": [
	  { "remove": { "index": "OLD", "alias": "MAIN" } },
	  { "add": { "index": "NEW", "alias": "MAIN" } }
	]
}'

	request=${request//OLD/$old_name}
	request=${request//NEW/$new_name}
	request=${request//MAIN/$ES_INDEX_MAIN}

	curl --fail -XPOST "$ELASTIC_NODE/_aliases" -H 'Content-Type: application/json' -d "$request"
}

get_index_name() {
	local version="$1"

	# shellcheck disable=SC2059
	printf "$INDEX_FORMAT" "$version"
}

generate_config() {
	local dict_version="$1"
	local outfile="$2"
	local map=$(get_package_map "$dict_version")
	local dict_len=$((${#dict_version} + 1))

	cp "$CODE_TEMPLATE" "$outfile"

	local parts
	local package_name
	local package_id
	local search
	local config=

	for m in $map; do
		# shellcheck disable=SC2206
		parts=(${m//;/ })
		package_name=${parts[0]}
		package_name=${package_name:0:-$dict_len}
		# strip lang-
		package_name=${package_name:3}
		package_id=${parts[1]}
		# Uppercase (like "{STEMMER}")
		search="{${package_name^^}}"

		config=${config//$search/$package_id}
		sed -i "s/$search/$package_id/g" "$outfile"
	done

}

get_package_map() {
	local dict_version="$1"

	$AWS_BIN es list-packages-for-domain --domain-name "$ES_DOMAIN" | jq -r '.DomainPackageDetailsList[]|select(.DomainPackageStatus=="ACTIVE")|(.PackageName+";"+.PackageID)' | grep -E -- "-$dict_version;"
}

get_index_version() {
	local index=$(curl --fail -s "$ELASTIC_NODE/$ES_INDEX_MAIN/_alias" | jq -r 'keys[0]')
	local len=${#index}

	echo "${index:0:$len}"
}

get_code_version() {
	local version="$(jq '.version' "$CODE_TEMPLATE")"

	printf "%04d" "$version"
}

do_migrate() {
	local dict_version=$(migrate_dictionary)
	local code_version=$(get_code_version)

	push_new_config_template "$dict_version"

	reindex_to_new_index "$code_version"
}

has_index_version() {
	local version="$1"
	local name=$(get_index_name "$version")

	curl --fail -s "$ELASTIC_NODE/_cat/indices" -H 'Content-Type: application/json' | grep -q -E "\b$name\b"
}

needs_migrate() {
	local code_version=$(get_code_version)

	if has_index_version "$code_version"; then
		return 1
	fi

	return 0
}

check_aws() {
	($AWS_BIN es list-domain-names | jq '.DomainNames[].DomainName' | grep -q "$ES_DOMAIN") && return

	echo "Could not find ES domain"
	exit 2
}

main() {
	if needs_migrate; then
		do_migrate
	fi
}

set -f

ARG1="${1:-}"

if [ "$ARG1" != "--test" ]; then
	set -e
	check_aws
	main
fi
