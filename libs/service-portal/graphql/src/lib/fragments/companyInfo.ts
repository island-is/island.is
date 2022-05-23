import { gql } from '@apollo/client'

export const CompanyInfoFragment = gql`
  fragment CompanyInfo on RskCompanyInfo {
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
`
