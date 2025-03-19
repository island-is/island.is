import { gql } from '@apollo/client'

export const UPDATE_LIST_ITEM = gql`
  mutation UpdateFormSystemListItem($input: FormSystemUpdateListItemInput!) {
    updateFormSystemListItem(input: $input)
  }
`
