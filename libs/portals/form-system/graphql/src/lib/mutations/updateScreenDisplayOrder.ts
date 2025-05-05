import { gql } from '@apollo/client'

export const UPDATE_SCREEN_DISPLAY_ORDER = gql`
  mutation UpdateFormSystemScreensDisplayOrder(
    $input: FormSystemUpdateScreensDisplayOrderInput!
  ) {
    updateFormSystemScreensDisplayOrder(input: $input)
  }
`
