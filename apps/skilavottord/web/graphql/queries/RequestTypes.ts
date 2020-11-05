import gql from 'graphql-tag'

export const REQUEST_TYPES = gql`
  query skilavottordRecyclingRequest($permno: String!) {
    skilavottordRecyclingRequest(permno: $permno) {
      id
      vehicleId
      requestType
      nameOfRequestor
      createdAt
      updatedAt
    }
  }
`
