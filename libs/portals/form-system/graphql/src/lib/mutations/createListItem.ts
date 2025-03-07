import { gql } from '@apollo/client'
import { ListItemFragment } from '../fragments/listItem'

export const CREATE_LIST_ITEM = gql`
  mutation CreateFormSystemListItem($input: FormSystemCreateListItemInput!) {
    createFormSystemListItem(input: $input) {
      ...ListItem
    }
  }
  ${ListItemFragment}
`
