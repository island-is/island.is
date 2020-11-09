import gql from 'graphql-tag'

export const CREATE_RECYCLING_REQUEST_CITIZEN = gql`
  mutation createSkilavottordRecyclingRequest(
    $nameOfRequestor: String
    $permno: String!
    $requestType: String!
  ) {
    createSkilavottordRecyclingRequest(
      nameOfRequestor: $nameOfRequestor
      permno: $permno
      requestType: $requestType
    )
  }
`

export const CREATE_RECYCLING_REQUEST_COMPANY = gql`
  mutation createSkilavottordRecyclingRequest(
    $partnerId: String
    $permno: String!
    $requestType: String!
  ) {
    createSkilavottordRecyclingRequest(
      partnerId: $partnerId
      permno: $permno
      requestType: $requestType
    )
  }
`
