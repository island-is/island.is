import gql from 'graphql-tag'

export const GET_NEWS_LIST_QUERY = gql`
  query($input: GetAdgerdirNewsListInput!) {
    getAdgerdirNewsList(input: $input) {
      page {
        page
        perPage
        totalPages
      }
      news {
        id
        title
        subtitle
        date
        slug
        intro
        image {
          url
          title
          width
          height
        }
      }
    }
  }
`

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
