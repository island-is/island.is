import { gql } from '@apollo/client'
import { ListItemFragment } from '../fragments/listItem'

export const CREATE_LIST_ITEM = gql`
  mutation FormSystemCreateListItem($input: FormSystemCreateListItemInput!) {
    formSystemCreateListItem(input: $input) {
      ...ListItemDto
    }
  }
  ${ListItemFragment}
`
