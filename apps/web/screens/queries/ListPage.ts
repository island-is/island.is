import gql from 'graphql-tag'

import { htmlFields } from './fragments'

export const GET_LIST_PAGE_QUERY = gql`
  query GetListPage($input: GetListPageInput!) {
    getListPage(input: $input) {
      id
      title
      relativeUrl
    }
  }
`

export const GET_LIST_ITEMS_QUERY = gql`
  query GetListItems($input: GetListItemsInput!) {
    getListItems(input: $input) {
      id
      title
      thumbnailContent {
        ...HtmlFields
      }
    }
  }
  ${htmlFields}
`
