import { gql } from '@apollo/client'

export const UPDATE_FIELD = gql`
  mutation UpdateFormSystemField($input: FormSystemUpdateFieldInput!) {
    updateFormSystemField(input: $input)
  }
`
