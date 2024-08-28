import { gql } from '@apollo/client'

export const UPDATE_SECTION_DISPLAY_ORDER = gql`
  mutation FormSystemUpdateSectionDisplayOrder(
    $input: FormSystemUpdateSectionDisplayOrderInput!
  ) {
    formSystemUpdateSectionDisplayOrder(input: $input)
  }
`
