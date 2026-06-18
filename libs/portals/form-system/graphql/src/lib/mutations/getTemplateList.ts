import { gql } from '@apollo/client'
import { ListItemFragment } from '../fragments/listItem'

export const GET_TEMPLATE_LIST = gql`
  mutation ApplyFormSystemTemplateList($input: FormSystemTemplateListInput!) {
    applyFormSystemTemplateList(input: $input) {
      ...ListItem
    }
  }
  ${ListItemFragment}
`
