import { gql } from '@apollo/client'

export const GET_PERSON = gql`
  query formSystemPersonByNationalId($input: String!) {
    formSystemPersonByNationalId(input: $input) {
      nationalId
      fullName
      name {
        firstName
        middleName
        lastName
        fullName
        displayName
      }
      address {
        streetAddress
        apartment
        postalCode
        city
        municipalityText
      }
    }
  }
`
