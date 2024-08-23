import { gql } from '@apollo/client'

export const UPDATE_FIELD = gql`
  mutation UpdateField($input: UpdateFieldInput!) {
    updateField(input: $input)
  }
`
