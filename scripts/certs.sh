echo "Generates a markdown file with the CNAME values for the certificates that are pending validation"
touch email.md
printf "# Beiðni um staðfestingu á skirteini fyrir lén\n\n" >email.md

printf "Við fengum beiðni um áframsendingu á slóð inn á undirssíðu hjá island.is. Við þurfum því að gefa út skilríki fyrir slóðina.\n\n\n" >>email.md
printf "Bæta þarf CNAME færslum við til hægt sé að sannreyna að þau séu í nafni eiganda lénsins.\n\n\n" >>email.md
printf "Hér koma lénin og gildin á CNAME færslunum:\n" >>email.md

arns=$(aws acm list-certificates --certificate-statuses PENDING_VALIDATION --includes keyTypes=RSA_1024,RSA_2048,RSA_3072,RSA_4096,EC_prime256v1,EC_secp384r1,EC_secp521r1 | jq -r '.CertificateSummaryList[] | .CertificateArn')

for arn in $arns; do
  cert=$(aws acm describe-certificate --certificate-arn $arn | jq '.Certificate.DomainValidationOptions')
  domains=$(echo $cert | jq -r '.[] | .DomainName')
  INDEX=0
  for i in $domains; do
    printf "* Domain Name: $i\n" >>email.md
    printf "\t* CNAME_VALUE: $(echo $cert | jq -r '.['$INDEX'] | .ResourceRecord | .Name')\n" >>email.md
    printf "\t* CNAME_NAME: $(echo $cert | jq -r '.['$INDEX'] | .ResourceRecord | .Value')\n\n" >>email.md
    let INDEX=${INDEX}+1
  done
done

printf "Með kveðju\n\nApró ehf." >>email.md
