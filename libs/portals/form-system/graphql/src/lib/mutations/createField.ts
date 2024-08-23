import { gql } from '@apollo/client'
import { FormFragment } from '../fragments/form'

export const CREATE_FIELD = gql`
  mutation FormSystemCreateField($input: FormSystemCreateFieldInput!) {
    formSystemCreateField(input: $input) {
      ...Form
    }
  }
  ${FormFragment}
`
