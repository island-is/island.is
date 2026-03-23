import { gql } from '@apollo/client'

export const VALIDATE_ACCOUNT_NUMBER = gql`
  query ValidateBankInformation($input: VmstApplicationsBankInformationInput!) {
    vmstApplicationsAccountNumberValidationUnemploymentApplication(
      input: $input
    ) {
      isValid
      userMessageIS
      userMessageEN
    }
  }
`

export const VALIDATE_VACATION = gql`
  query ValidateVacation($input: VmstApplicationsVacationValidationInput!) {
    vmstApplicationsVacationValidationUnemploymentApplication(input: $input) {
      isValid
      userMessageIS
      userMessageEN
    }
  }
`
