import { gql } from '@apollo/client'

export const DELETE_FORM_DELEGATION = gql`
  mutation DeleteFormSystemFormDelegation(
    $input: FormSystemUpdateFormDelegationInput!
  ) {
    deleteFormSystemFormDelegation(input: $input)
  }
`
