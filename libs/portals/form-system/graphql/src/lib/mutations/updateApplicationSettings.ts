import { gql } from '@apollo/client'

export const UPDATE_APPLICATION_SETTINGS = gql`
  mutation UpdateFormSystemApplicationSettings(
    $input: UpdateFormSystemApplicationInput!
  ) {
    updateFormSystemApplicationSettings(input: $input)
  }
`
