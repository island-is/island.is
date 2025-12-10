import { gql } from '@apollo/client'

export const DELETE_FORM_URL = gql`
  mutation DeleteFormSystemFormUrl($input: FormSystemFormUrlInput!) {
    deleteFormSystemFormUrl(input: $input)
  }
`
