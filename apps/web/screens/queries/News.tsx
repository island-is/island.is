import gql from 'graphql-tag'
import { slices } from './fragments'

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

export const GET_SINGLE_NEWS_ITEM_QUERY = gql`
  query GetSingleNewsItem($input: GetSingleNewsInput!) {
    getSingleNews(input: $input) {
      id
      title
      subtitle
      date
      slug
      intro
      author {
        name
      }
      content {
        ...AllSlices
      }
      image {
        url
        title
        width
        height
      }
    }
  }
  ${slices}
`
