import { gql } from '@apollo/client'

export const UPDATE_FORM_STATUS = gql`
  mutation UpdateFormSystemFormStatus(
    $input: FormSystemUpdateFormStatusInput!
  ) {
    updateFormSystemFormStatus(input: $input)
  }
`
