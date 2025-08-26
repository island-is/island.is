import { gql } from '@apollo/client'

export const UPDATE_APPLICATION_DEPENDENCIES = gql`
  mutation UpdateFormSystemApplicationDependencies(
    $input: UpdateFormSystemApplicationInput!
  ) {
    updateFormSystemApplicationDependencies(input: $input)
  }
`
