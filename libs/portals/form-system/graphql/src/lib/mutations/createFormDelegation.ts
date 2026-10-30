import { gql } from '@apollo/client'

export const CREATE_FORM_DELEGATION = gql`
  mutation CreateFormSystemFormDelegation(
    $input: FormSystemUpdateFormDelegationInput!
  ) {
    createFormSystemFormDelegation(input: $input)
  }
`
