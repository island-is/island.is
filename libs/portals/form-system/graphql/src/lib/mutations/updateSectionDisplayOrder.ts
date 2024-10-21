import { gql } from '@apollo/client'

export const UPDATE_SECTION_DISPLAY_ORDER = gql`
  mutation FormSystemUpdateSectionsDisplayOrder(
    $input: FormSystemUpdateSectionsDisplayOrderDtoInput!
  ) {
    formSystemUpdateSectionsDisplayOrder(input: $input)
  }
`
