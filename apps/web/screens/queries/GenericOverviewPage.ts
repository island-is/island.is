import gql from 'graphql-tag'

export const GET_GENERIC_OVERVIEW_PAGE_QUERY = gql`
  fragment HtmlFields on Html {
    __typename
    id
    document
  }
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
      overviewLinks {
        title
        linkTitle
        link {
          type
          slug
        }
        image {
          title
          url
          width
          height
        }
      }
    }
  }
`
