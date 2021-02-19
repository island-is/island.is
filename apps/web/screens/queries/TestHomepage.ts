import gql from 'graphql-tag'

export const GET_TEST_HOMEPAGE_QUERY = gql`
  query GetTestHomepage($input: GetTestHomepageInput!) {
    getTestHomepage(input: $input) {
      featuredThings {
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
