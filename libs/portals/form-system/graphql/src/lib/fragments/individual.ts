import { gql } from '@apollo/client'

export const IndividualFragment = gql`
  fragment IndividualFields on IndividualLite {
    nationalId
    name
    legalDomicile {
      streetAddress
      postalCode
      locality
      municipalityNumber
    }
    residence {
      streetAddress
      postalCode
      locality
      municipalityNumber
    }
  }
`
