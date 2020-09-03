import gql from 'graphql-tag'

export const GET_NEWS_QUERY = gql`
  query GetAdgerdirNewsPages($input: GetAdgerdirNewsInput!) {
    getAdgerdirNews(input: $input) {
      id
      subtitle
      title
      slug
      intro
      image {
        url
        title
        contentType
        width
        height
      }
      date
      content
      pages {
        id
      }
    }
  }
`
