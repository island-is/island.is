import gql from 'graphql-tag'

import { nestedFields, slices } from './fragments'

export const GET_ANCHOR_PAGE_QUERY = gql`
  query GetAnchorPage($input: GetAnchorPageInput!) {
    getAnchorPage(input: $input) {
      id
      title
      slug
      intro
      image {
        ...ImageFields
      }
      content {
        ...AllSlices
        ${nestedFields}
      }
      featuredImage {
        ...ImageFields
      }
    }
  }
  ${slices}
`

export const GET_ANCHOR_PAGES_QUERY = gql`
  query GetAnchorPages($input: GetAnchorPagesInput!) {
    getAnchorPages(input: $input) {
      id
      title
      slug
      intro
      thumbnail {
        url
        title
      }
      image {
        url
        title
      }
    }
  }
`

export const GET_ANCHOR_PAGES_IN_CATEGORY_QUERY = gql`
  query GetAnchorPagesInCategory($input: GetAnchorPagesInCategoryInput!) {
    getAnchorPagesInCategory(input: $input) {
      id
      title
      slug
      intro
      category {
        title
        slug
      }
      thumbnail {
        url
        title
      }
      image {
        url
        title
      }
    }
  }
`
