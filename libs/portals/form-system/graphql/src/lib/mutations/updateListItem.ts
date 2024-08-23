import { gql } from '@apollo/client'

export const UPDATE_LIST_ITEM = gql`
  mutation FormSystemUpdateListItem($input: FormSystemUpdateListItemInput!) {
    formSystemUpdateListItem(input: $input)
  }
`
