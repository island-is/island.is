import { gql } from '@apollo/client'

export const DELETE_LIST_ITEM = gql`
  mutation FormSystemDeleteListItem($input: FormSystemDeleteListItemInput!) {
    formSystemDeleteListItem(input: $input)
  }
`
