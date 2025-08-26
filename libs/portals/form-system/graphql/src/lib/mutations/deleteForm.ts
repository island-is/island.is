import { gql } from '@apollo/client'

export const DELETE_FORM = gql`
  mutation DeleteFormSystemForm($input: FormSystemDeleteFormInput!) {
    deleteFormSystemForm(input: $input)
  }
`
