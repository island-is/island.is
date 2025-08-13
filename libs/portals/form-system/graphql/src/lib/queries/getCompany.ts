import { gql } from '@apollo/client'

export const GET_COMPANY_BY_NATIONALID = gql`
  query formSystemCompanyByNationalId($input: String!) {
    formSystemCompanyByNationalId(input: $input) {
      name
      address {
        ...CompanyAddress
      }
    }
  }
`
