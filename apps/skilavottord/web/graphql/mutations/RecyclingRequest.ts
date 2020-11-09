import gql from 'graphql-tag'

export const CREATE_RECYCLING_REQUEST = gql`
  mutation createSkilavottordRecyclingRequest(
    $partnerId: String
    $nameOfRequestor: String
    $permno: String!
    $requestType: String!
  ) {
    createSkilavottordRecyclingRequest(
      partnerId: $partnerId
      nameOfRequestor: $nameOfRequestor
      permno: $permno
      requestType: $requestType
    )
  }
`
