import { gql } from '@apollo/client'

export const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const taxInfoQuery = gql`
  query TaxInfoQuery($year: String!) {
    financialStatementsInaoTaxInfo(year: $year) {
      key
      value
    }
  }
`

export const financialLimitQuery = gql`
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
