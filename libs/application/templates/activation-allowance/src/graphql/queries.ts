import { gql } from '@apollo/client'

export const VALIDATE_ACCOUNT_NUMBER = gql`
  query ValidateBankInformation($input: BankInformationInput!) {
    vmstApplicationsAccountNumbervalidation(input: $input)
  }
`
