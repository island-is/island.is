import { gql } from '@apollo/client'

export const UPDATE_SCREEN_DISPLAY_ORDER = gql`
  mutation FormSystemUpdateScreenDisplayOrder(
    $input: FormSystemUpdateScreenDisplayOrderInput!
  ) {
    formSystemUpdateScreenDisplayOrder(input: $input)
  }
`
