import gql from 'graphql-tag'

export const GET_URL_QUERY = gql`
  query GetUrl($input: GetUrlInput!) {
    getUrl(input: $input) {
      id
      title
      urlsList
      page {
        slug
        type
      }
      explicitRedirect
    }
  }
`
