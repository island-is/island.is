import { gql } from '@apollo/client'

export const UPDATE_FORM = gql`
  mutation FormSystemUpdateForm($input: FormSystemUpdateFormInput!) {
    formSystemUpdateForm(input: $input) {
      updateSuccess
      errors {
        field
        message
      }
    }
  }
`
