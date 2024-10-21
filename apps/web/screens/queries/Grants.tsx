import gql from 'graphql-tag'

export const GET_GRANTS_QUERY = gql`
  query GetGenericTagBySlug($input: GetGenericTagBySlugInput!) {
    getGenericTagBySlug(input: $input) {
      id
      slug
    }
  }
`
