import gql from 'graphql-tag'

export const GET_RECYCLING_PARTNER = gql`
  query getRecyclingPartner($id: Float!) {
    getRecyclingPartner(id: $id) {
      id
      name
      address
      postNumber
      website
      phone
      active
    }
  }
`
