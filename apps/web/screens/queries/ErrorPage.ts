import gql from 'graphql-tag'

export const GET_ERROR_PAGE = gql`
  query ErrorPage($input: GetErrorPageInput!) {
    getErrorPage(input: $input) {
      errorCode
      title
      description {
        ... on Html {
          __typename
          id
          document
        }
      }
    }
  }
`
