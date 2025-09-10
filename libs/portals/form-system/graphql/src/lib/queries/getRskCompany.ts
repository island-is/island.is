import { gql } from '@apollo/client'

export const GET_COMPANY = gql`
  query CompanyIdentityQuery($input: RskCompanyInfoInput!) {
    companyRegistryCompany(input: $input) {
      name
    }
  }
`
