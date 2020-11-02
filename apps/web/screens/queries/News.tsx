import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_NEWS_QUERY = gql`
  query GetNews($input: GetNewsInput!) {
    getNews(input: $input) {
      total
      items {
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
        genericTags {
          id
          title
        }
      }
    }
  }
`

export const GET_NEWS_DATES_QUERY = gql`
  query GetNewsDates($input: GetNewsDatesInput!) {
    getNewsDates(input: $input)
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
      genericTags {
        id
        title
      }
    }
  }
  ${slices}
`
