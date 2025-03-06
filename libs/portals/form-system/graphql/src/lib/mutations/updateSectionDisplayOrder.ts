import { gql } from '@apollo/client'

export const UPDATE_SECTION_DISPLAY_ORDER = gql`
  mutation UpdateFormSystemSectionsDisplayOrder(
    $input: FormSystemUpdateSectionsDisplayOrderInput!
  ) {
    updateFormSystemSectionsDisplayOrder(input: $input)
  }
`
