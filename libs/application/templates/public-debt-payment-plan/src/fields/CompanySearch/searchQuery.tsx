import gql from 'graphql-tag'


export const COMPANY_REGISTRY_COMPANIES = gql`
  query SearchCompanies($input: RskCompanyInfoSearchInput!) {
    companyRegistryCompanies(input: $input) {
      data {
        name
        nationalId
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`