import gql from 'graphql-tag'

export const GET_CAR_OWNER = gql`
  query getCarownerByNationalId($nationalId: String!) {
    getCarownerByNationalId(nationalId: $nationalId) {
      name
      nationalId
      mobile
      cars {
        id
        name
        model
        color
        year
        recyclable
      }
    }
  }
`
