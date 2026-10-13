import { gql } from '@apollo/client'

export const VALIDATE_INCOMES_QUERY = gql`
  query VmstApplicationsValidateIncomes(
    $input: VmstApplicationsIncomeValidationInput!
  ) {
    vmstApplicationsValidateIncomes(input: $input) {
      isValid
      invalidValidationIds
      errors {
        validationId
        reason
        reasonEN
      }
    }
  }
`
