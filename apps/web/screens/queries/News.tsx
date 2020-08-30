import gql from 'graphql-tag'

export const GET_NEWS_LIST_QUERY = gql`
  query GetNewsList($input: GetNewsListInput!) {
    getNewsList(input: $input) {
      page {
        page
        perPage
        totalPages
      }
      news {
        id
        title
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

export const GET_NEWS_ITEM_QUERY = gql`
  query GetNewsItem($input: GetNewsInput!) {
    getNews(input: $input) {
      id
      title
      date
      slug
      intro
      content
      image {
        url
        title
        width
        height
      }
    }
  }
`
