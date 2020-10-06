import gql from 'graphql-tag'

export const GET_HOMEPAGE_QUERY = gql`
  query GetHomepage($input: GetHomepageInput!) {
    getHomepage(input: $input) {
      featuredThings {
        title
        attention
        thing {
          slug
        }
      }
    }
  }
`
