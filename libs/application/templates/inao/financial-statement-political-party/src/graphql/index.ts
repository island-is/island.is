import { gql } from '@apollo/client'

export const auditConfigQuery = gql`
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
