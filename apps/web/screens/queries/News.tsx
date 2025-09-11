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
        imageText
        genericTags {
          id
          title
          slug
        }
      }
    }
  }
`

export const GET_NEWS_WITH_CONTENT_QUERY = gql`
  query GetNewsWithContent($input: GetNewsInput!) {
    getNews(input: $input) {
      total
      items {
        id
        title
        subtitle
        date
        slug
        intro
        fullWidthImageInContent
        content {
          ...AllSlices
        }
        image {
          url
          title
          width
          height
        }
        imageText
        genericTags {
          id
          title
          slug
        }
      }
    }
  }
  ${slices}
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
      fullWidthImageInContent
      content {
        ...AllSlices
      }
      image {
        url
        title
        width
        height
      }
      imageText
      featuredImage {
        url
        title
        width
        height
      }
      genericTags {
        id
        title
        slug
      }
      organization {
        slug
        canPagesBeFoundInSearchResults
        newsBottomSlices {
          ...EmailSignupFields
        }
      }
      signLanguageVideo {
        url
        thumbnailImageUrl
      }
    }
  }
  ${slices}
`
