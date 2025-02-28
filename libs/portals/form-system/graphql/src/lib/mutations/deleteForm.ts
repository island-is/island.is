import { gql } from '@apollo/client'

export const DELETE_FORM = gql`
  mutation FormSystemDeleteForm($input: FormSystemDeleteFormInput!) {
    formSystemDeleteForm(input: $input)
  }
`
