import gql from 'graphql-tag'

export const SET_RECYCLING_REQUEST = gql`
  mutation createSkilavottordRecyclingRequest($requestType: String!, $permno: String!, $partnerId: String) {
    createSkilavottordRecyclingRequest(requestType: $requestType, permno: $permno, partnerId: $partnerId)
  }
`
