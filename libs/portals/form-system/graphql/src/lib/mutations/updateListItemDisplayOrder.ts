import { gql } from '@apollo/client'

export const UPDATE_LIST_ITEM_DISPLAY_ORDER = gql`
  mutation FormSystemUpdateListItemsDisplayOrder(
    $input: FormSystemUpdateListItemsDisplayOrderInput!
  ) {
    formSystemUpdateListItemsDisplayOrder(input: $input)
  }
`
