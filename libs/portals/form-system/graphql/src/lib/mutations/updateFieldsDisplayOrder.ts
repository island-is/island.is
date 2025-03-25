import { gql } from '@apollo/client'

export const UPDATE_FIELDS_DISPLAY_ORDER = gql`
  mutation UpdateFormSystemFieldsDisplayOrder(
    $input: FormSystemUpdateFieldsDisplayOrderInput!
  ) {
    updateFormSystemFieldsDisplayOrder(input: $input)
  }
`
