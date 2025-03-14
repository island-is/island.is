import { gql } from '@apollo/client'

export const UPDATE_LIST_ITEM_DISPLAY_ORDER = gql`
  mutation UpdateFormSystemListItemsDisplayOrder(
    $input: FormSystemUpdateListItemsDisplayOrderInput!
  ) {
    updateFormSystemListItemsDisplayOrder(input: $input)
  }
`
