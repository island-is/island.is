import gql from 'graphql-tag'

export const GET_URL_QUERY = gql`
  query GetUrl($input: GetUrlInput!) {
    getUrl(input: $input) {
      id
      title
      urlsList
      page {
        __typename
        ... on Article {
          slug
        }
        ... on ArticleCategory {
          slug
        }
        ... on News {
          slug
        }
        ... on LifeEventPage {
          slug
        }
      }
    }
  }
`
