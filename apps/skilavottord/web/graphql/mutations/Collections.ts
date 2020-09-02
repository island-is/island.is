import gql from 'graphql-tag'

export const DELETE_COLLECTIONS = gql`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(where: {id: $id}) {
      collections {
        id
        title
        items {
          id
          name
          price
          imageUrl
        }
      }
    }
  }
`