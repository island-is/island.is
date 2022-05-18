import { gql } from '@apollo/client'
import { CompanyInfoFragment } from '../fragments/companyInfo'

export const COMPANY_REGISTRY_INFORMATION = gql`
  query companyRegistryCompanyQuery($input: RskCompanyInfoInput!) {
    companyRegistryCompany(input: $input) {
      name
      nationalId
      dateOfRegistration
      companyInfo {
        ...CompanyInfo
      }
    }
  }
  ${CompanyInfoFragment}
`
