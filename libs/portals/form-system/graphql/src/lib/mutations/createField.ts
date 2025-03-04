import { gql } from '@apollo/client'
import { FieldFragment } from '../fragments/field'

export const CREATE_FIELD = gql`
  mutation CreateFormSystemField($input: FormSystemCreateFieldInput!) {
    createFormSystemField(input: $input) {
      ...Field
    }
  }
  ${FieldFragment}
`
