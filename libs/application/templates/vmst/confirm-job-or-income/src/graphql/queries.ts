import { gql } from '@apollo/client'

export const VALIDATE_INCOMES_QUERY = gql`
  query VmstApplicationsValidateIncomes($input: IncomeValidationInput!) {
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
