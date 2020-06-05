#!/usr/bin/env bash

ES_INDEX_MAIN="${ELASTIC_INDEX:-island-is}"
ES_DOMAIN="${ES_DOMAIN:-search}"
CODE_TEMPLATE="${CODE_TEMPLATE:-/webapp/config/template-is.json}"
GITHUB_DICT_REPO="${GITHUB_DICT_REPO:-https://github.com/island-is/elasticsearch-dictionaries}"
S3_BUCKET="${S3_BUCKET:-stefna-es-test01}"
S3_FOLDER="${S3_FOLDER:-is}"

S3_FULL_PATH="s3://$S3_BUCKET/$S3_FOLDER"
INDEX_FORMAT="island-is-v%d"
TEMPLATE_NAME="template-is"
AWS_INSTALL_DIR="/tmp/aws-cli"
AWS_BIN="$AWS_INSTALL_DIR/v2/current/bin/aws"

if [ "$ELASTIC_NODE" == "" ]; then
	echo "Error: No ELASTIC_NODE defined"
	exit 1
fi

if ! command -v curl >/dev/null; then
	echo "Error: curl is missing"
	exit 1
fi

if ! command -v jq >/dev/null; then
	apk install jq
	if ! command -v jq >/dev/null; then
		exit 1
	fi
fi

install_deps() {
	local dir=/tmp/aws-install

	mkdir "$dir"
	cd "$dir"
	curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
	unzip awscliv2.zip
	./aws/install --install-dir "$AWS_INSTALL_DIR" --bin-dir /dev/null
}

migrate_dictionary() {
	local version=$(get_next_dictionary_version)

	if [ "$version" != "" ]; then
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
	curl -s --output $file "$url"
	tar xf $file
	rm $file

	set +f
	for f in *; do
		push_package "$version" "$f"
	done
	set -f
}

push_package() {
	local version="$1"
	local file="$2"

	push_to_s3 "$file"
	create_package "$version" "$file"
}

create_package() {
	local version="$1"
	local file="$(basename "$2")"

	local package_name=$(get_package_name "$version" "$file")
	local package_type="TXT-DICTIONARY"

	local out=$($AWS_BIN es create-package --package-name "$package_name" --package-type "$package_type" --package-source "S3BucketName=$S3_BUCKET,S3Key=$S3_FOLDER/$file")

	local package_id=$(echo "$out" | jq -r '.PackageDetails.PackageID')

	$AWS_BIN es associate-package --package-id "$package_id" --domain-name "$ES_DOMAIN" > /dev/null

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
	# Strip extension
	local file="${2/.*/}"

	echo "$file-$version"
}

get_package_version_from_name() {
	# Can return empty to mark as not found
	local package_name="$1"

	if [[ ! "$package_name" =~ ^[a-z]+-[0-9]+$ ]]; then
		echo ""
		return
	fi

	echo "${package_name//*-/}"
}

push_to_s3() {
	local file="$1"

	$AWS_BIN s3 cp --quiet "$file" "$S3_FULL_PATH/"
}

get_dictionary_release_url() {
	curl -s "$GITHUB_DICT_REPO/releases/latest" | jq -r '.assets[].browser_download_url' | grep '\.tar\.gz' | head -n 1
}

get_dictionary_latest_version() {
	curl -s "$GITHUB_DICT_REPO/releases/latest" | jq -r '.tag_name'
}

get_next_dictionary_version() {
	# Return '' to notify not updated is needed
	# If we don't have any packages that match the version patter, we return the repo version

	local repo_version="$(get_dictionary_latest_version)"
	# Just pick the stemmer as an example to find version
	local stemmer=$(get_all_es_packages | jq -r '.DomainPackageDetailsList[].PackageName' | grep stemmer | head -n 1)
	local version=$(get_package_version_from_name "$stemmer")

	if [[ "$version" == "" ]] || [[ "$version" -lt "$repo_version" ]]; then
		echo "$repo_version"
	fi
	echo ""
}

get_all_es_packages() {
	$AWS_BIN es list-packages-for-domain --domain-name "$ES_DOMAIN"
}

push_new_config_template() {
	local dict_version="$1"
	local generated_config=$(generate_config "$dict_version")
	local tmp=$(mktemp)

	echo "$generated_config" >"$tmp"

	curl -XPUT "$ELASTIC_NODE/_template/$TEMPLATE_NAME" -H 'Content-Type: application/json' -d @"$tmp"
}

reindex_to_new_index() {
	local dict_version="$1"
	local request='{
	"source": {
		"index": "OLD"
	},
	"dest": {
		"index": "NEW"
	}
}'
	local old_version=$((dict_version - 1))
	local old_name=$(get_index_name $old_version)
	local new_name=$(get_index_name "$dict_version")

	request=${request//OLD/$old_name}
	request=${request//NEW/$new_name}
	curl -XPOST "$ELASTIC_NODE/_reindex" -H 'Content-Type: application/json' -d "$request"
}

get_index_name() {
	local version="$1"

	# shellcheck disable=SC2059
	printf "$INDEX_FORMAT" "$version"
}

generate_config() {
	local dict_version="$1"
	local map=$(get_package_map "$dict_version")
	local dict_len=$((${#dict_version} + 1))

	local config="$(cat $CODE_TEMPLATE)"

	local parts
	local package_name
	local package_id
	local search

	for m in $map; do
		# shellcheck disable=SC2206
		parts=(${m//;/ })
		package_name=${parts[0]}
		package_name=${package_name:0:-$dict_len}
		package_id=${parts[1]}
		# Uppercase (like "{STEMMER}")
		search="{${package_name^^}}"

		config=${config//$search/$package_id}
	done

	echo "$config"
}

get_package_map() {
	local dict_version="$1"

	$AWS_BIN es list-packages-for-domain --domain-name test01 | jq -r '.DomainPackageDetailsList[]|(.PackageName+";"+.PackageID)' | grep -E -- "-$dict_version;"
}

get_index_version() {
	local index=$(curl -s "$ELASTIC_NODE/$ES_INDEX_MAIN/_alias" | jq -r 'keys[0]')
	local len=${#index}

	echo "${index:0:$len}"
}

get_code_version() {
	local version="$(jq '.version' $CODE_TEMPLATE)"

	printf "%04d" "$version"
}

do_migrate() {
	local dict_version=$(migrate_dictionary)

	push_new_config_template "$dict_version"

	reindex_to_new_index "$dict_version"
}

has_index_version() {
	local version="$1"
	local name=$(get_index_name "$version")

	curl -s "$ELASTIC_NODE/_cat/indices" -H 'Content-Type: application/json'|grep -q -E "\b$name\b"
}

needs_migrate() {
	local code_version=$(get_code_version)

	if has_index_version "$code_version" ; then
		return 1
	fi

	return 0
}

main() {
	if needs_migrate; then
		do_migrate
	fi
}

set -f

if [ "$1" != "--test" ]; then
	set -e
	install_deps
	main
fi
