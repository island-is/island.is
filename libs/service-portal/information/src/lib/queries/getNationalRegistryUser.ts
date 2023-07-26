import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_USER = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      nationalId
      maritalStatus
      religion
      legalResidence
      birthPlace
      familyNr
      fullName
      firstName
      middleName
      lastName
      banMarking {
        banMarked
      }
      gender
      spouse {
        name
        nationalId
        cohabitant
      }
      citizenship {
        code
        name
      }
    }
  }
`

export const NATIONAL_REGISTRY_USER_V3 = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUserV3 {
      nationalId
      fullName
      genderCode
      familyRegistrationCode
      banMarking
      name {
        givenName
        middleName
        lastName
      }
      address {
        streetName
        postalCode
        city
      }
      birthplace {
        location
      }
      spouse {
        maritalStatus
      }
      religion {
        name
      }
    }
  }
`
