import { gql } from '@apollo/client'
import { ListItemFragment } from '../fragments/listItem'

export const DATA_FROM_URL = gql`
  mutation FormSystemDataFromUrl($input: FormSystemDataFromUrlInput!) {
    formSystemDataFromUrl(input: $input) {
      placeholder {
        is
        en
      }
      list {
        ...ListItem
      }
      isError
    }
  }
  ${ListItemFragment}
`
