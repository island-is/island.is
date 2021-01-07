import gql from 'graphql-tag'

export const GET_GENERIC_OVERVIEW_PAGE_QUERY = gql`
  query GetGenericOverviewPage($input: GetGenericOverviewPageInput!) {
    getGenericOverviewPage(input: $input) {
      id
      title
      intro {
        ...HtmlFields
      }
      navigation {
        title
        menuLinks {
          title
          link {
            slug
            type
          }
        }
      }
    }
  }
`