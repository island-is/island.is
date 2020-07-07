import gql from 'graphql-tag'

export const GET_NEWS_LIST_QUERY = gql`
  query($input: GetNewsListInput) {
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
