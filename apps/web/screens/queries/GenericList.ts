import gql from 'graphql-tag'

import { htmlFields } from './fragments'

export const GET_GENERIC_LIST_ITEMS_QUERY = gql`
  query GetGenericListItems($input: GetGenericListItemsInput!) {
    getGenericListItems(input: $input) {
      items {
        id
        date
        title
        cardIntro {
          ...HtmlFields
        }
      }
      total
    }
  }
  ${htmlFields}
`
