import { gql } from '@apollo/client'

export const UPDATE_FIELDS_DISPLAY_ORDER = gql`
  mutation FormSystemUpdateFieldsDisplayOrder(
    $input: FormSystemUpdateFieldsDisplayOrderInput!
  ) {
    formSystemUpdateFieldsDisplayOrder(input: $input)
  }
`
