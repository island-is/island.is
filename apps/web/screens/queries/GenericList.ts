import gql from 'graphql-tag'

import { htmlFields, nestedFields, slices } from './fragments'

export const GET_GENERIC_LIST_ITEMS_QUERY = gql`
  query GetGenericListItems($input: GetGenericListItemsInput!) {
    getGenericListItems(input: $input) {
      input {
        page
        queryString
        tags
      }
      items {
        id
        date
        title
        cardIntro {
          ...HtmlFields
        }
        filterTags {
          id
          title
          slug
        }
        slug
        assetUrl
        externalUrl
        image {
          url
          title
          width
          height
        }
      }
      total
    }
  }
  ${htmlFields}
`

export const GET_GENERIC_LIST_ITEM_BY_SLUG_QUERY = gql`
  query GetGenericListItemBySlug($input: GetGenericListItemBySlugInput!) {
    getGenericListItemBySlug(input: $input) {
      id
      date
      title
      slug
      content {
        ...AllSlices
        ${nestedFields}
      }
      image {
        url
        title
        width
        height
      }
      filterTags {
        id
        title
      }
      fullWidthImageInContent
    }
  }
  ${slices}
`
