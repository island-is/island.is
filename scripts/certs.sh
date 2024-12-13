#!/bin/bash
set -euo pipefail

# Configuration
OUTPUT_FILE="${1:-email.md}"

echo "Generates a markdown file with the CNAME values for the certificates that are pending validation"

# Ensure clean start
if [ -f "$OUTPUT_FILE" ]; then
  rm "$OUTPUT_FILE"
fi
touch "$OUTPUT_FILE" || {
  echo "Error: Cannot create $OUTPUT_FILE"
  exit 1
}

{
  printf "# Beiðni um staðfestingu á skirteini fyrir lén\n\n"
  printf "Við fengum beiðni um áframsendingu á slóð inn á undirssíðu hjá island.is. Við þurfum því að gefa út skilríki fyrir slóðina.\n\n\n"
  printf "Bæta þarf CNAME færslum við til hægt sé að sannreyna að þau séu í nafni eiganda lénsins.\n\n\n"
  printf "Hér koma lénin og gildin á CNAME færslunum:\n"
} >"$OUTPUT_FILE"

# Check AWS CLI availability
command -v aws >/dev/null 2>&1 || {
  echo "Error: AWS CLI is required but not installed"
  exit 1
}

# Check AWS credentials
aws sts get-caller-identity >/dev/null 2>&1 || {
  echo "Error: AWS credentials not configured"
  exit 1
}

# Fetch certificates pending validation
echo "Fetching certificates pending validation..."
arns=$(aws acm list-certificates \
  --certificate-statuses PENDING_VALIDATION \
  --includes keyTypes=RSA_1024,RSA_2048,RSA_3072,RSA_4096,EC_prime256v1,EC_secp384r1,EC_secp521r1 \
  2>/dev/null |
  jq -r '.CertificateSummaryList[] | .CertificateArn') ||
  {
    echo "Error: Failed to fetch certificates"
    exit 1
  }

# Validate we got some certificates
if [ -z "$arns" ]; then
  echo "No certificates found pending validation"
  exit 0
fi
for arn in $arns; do
  # Fetch certificate details
  cert=$(aws acm describe-certificate --certificate-arn "$arn" 2>/dev/null) ||
    {
      echo "Error: Failed to fetch certificate details for $arn"
      continue
    }

  # Extract validation options
  validation_options=$(echo "$cert" | jq -r '.Certificate.DomainValidationOptions')
  if [ -z "$validation_options" ] || [ "$validation_options" = "null" ]; then
    echo "Warning: No validation options found for $arn"
    continue
  fi

  # Process each domain
  echo "$validation_options" | jq -r '
    to_entries | .[] | @sh "DOMAIN=\(.value.DomainName) NAME=\(.value.ResourceRecord.Name) VALUE=\(.value.ResourceRecord.Value)"
  ' | while read -r line; do
    eval "$line"
    {
      printf "* Domain Name: %s\n" "$DOMAIN"
      printf "\t* CNAME_VALUE: %s\n" "$NAME"
      printf "\t* CNAME_NAME: %s\n\n" "$VALUE"
    } >>"$OUTPUT_FILE" || {
      echo "Error: Failed to write domain details"
      exit 1
    }
  done
done

printf "Með kveðju\n\nApró ehf." >>"$OUTPUT_FILE"
