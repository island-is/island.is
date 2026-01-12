import { gql } from '@apollo/client'

export const UPDATE_FORM = gql`
  mutation UpdateFormSystemForm($input: FormSystemUpdateFormInput!) {
    updateFormSystemForm(input: $input) {
      updateSuccess
      errors {
        field
        message
      }
    }
  }
`
