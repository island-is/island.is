import { gql } from '@apollo/client'

export const getAvailableElections = gql`
  query FinancialStatementsInaoElections {
    financialStatementsInaoElections {
      electionId
      name
      electionDate
    }
  }
`

export const getFinancialLimit = gql`
  query FinancialStatementsInaoClientFinancialLimit(
    $input: InaoClientFinancialLimitInput!
  ) {
    financialStatementsInaoClientFinancialLimit(input: $input)
  }
`

export const getAuditConfig = gql`
  query FinancialStatementsInaoConfig {
    financialStatementsInaoConfig {
      value
      key
    }
  }
`

export const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`
export const TaxInfoQuery = gql`
  query TaxInfoQuery($year: String!) {
    financialStatementsInaoTaxInfo(year: $year) {
      key
      value
    }
  }
`
