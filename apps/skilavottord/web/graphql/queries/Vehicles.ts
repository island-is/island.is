import gql from 'graphql-tag'

export const GET_VEHICLES = gql`
  query skilavottordVehicles($nationalId: String!) {
    skilavottordVehicles(nationalId: $nationalId) {
      permno
      type
      color
      firstRegDate
      isRecyclable
      hasCoOwner
      status
    }
  }
`
