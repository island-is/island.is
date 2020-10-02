import gql from 'graphql-tag'

export const GET_CARS = gql`
  query getVehiclesForNationalId($nationalId: String!) {
    getVehiclesForNationalId(nationalId: $nationalId) {
      name
      nationalId
      mobile
      cars {
        permno
        type
        color
        newregdate
        recyclable
      }
    }
  }
`
