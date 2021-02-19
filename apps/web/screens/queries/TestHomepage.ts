import gql from 'graphql-tag'

export const GET_TEST_HOMEPAGE_QUERY = gql`
  query GetTestHomepage($input: GetTestHomepageInput!) {
    getTestHomepage(input: $input) {
      featured {
        title
        attention
        thing {
          slug
          type
        }
      }
    }
  }
`
