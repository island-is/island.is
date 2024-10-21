import { gql } from '@apollo/client'

export const UPDATE_SCREEN_DISPLAY_ORDER = gql`
  mutation FormSystemUpdateScreensDisplayOrder(
    $input: FormSystemUpdateScreensDisplayOrderInput!
  ) {
    formSystemUpdateScreensDisplayOrder(input: $input)
  }
`
