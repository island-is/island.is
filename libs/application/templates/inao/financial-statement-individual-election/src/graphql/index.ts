import { gql } from '@apollo/client'

export const availableElectionsQuery = gql`
  query FinancialStatementsInaoElections {
    financialStatementsInaoElections {
      electionId
      name
      electionDate
      genitiveName
    }
  }
`

export const electionFinancialLimitQuery = gql`
  query FinancialStatementsInaoClientFinancialLimit(
    $input: InaoClientFinancialLimitInput!
  ) {
    financialStatementsInaoClientFinancialLimit(input: $input)
  }
`
