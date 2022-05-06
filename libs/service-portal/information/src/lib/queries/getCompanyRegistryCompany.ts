import { gql } from '@apollo/client'

export const COMPANY_REGISTRY_INFORMATION = gql`
  query companyRegistryCompanyQuery($input: RskCompanyInfoInput!) {
    companyRegistryCompany(input: $input) {
      name
      nationalId
      dateOfRegistration
      companyInfo {
        formOfOperation {
          type
          name
        }
        vat {
          vatNumber
          classification {
            type
            classificationSystem
            number
            name
          }
        }
        address {
          streetAddress
          postalCode
          locality
          municipalityNumber
          country
        }
      }
    }
  }
`
