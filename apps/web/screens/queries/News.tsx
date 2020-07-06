import gql from 'graphql-tag'

export const GET_NEWS_LIST_QUERY = gql`
  query ($input: GetNewsListInput) {
    getNewsList(input: $input) {
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
`
