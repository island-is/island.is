import { gql } from '@apollo/client'

export const VALIDATE_ACCOUNT_NUMBER = gql`
  query ValidateBankInformation($input: VmstApplicationsBankInformationInput!) {
    vmstApplicationsAccountNumberValidation(input: $input)
  }
`
