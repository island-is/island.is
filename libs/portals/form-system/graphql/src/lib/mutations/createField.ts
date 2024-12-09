import { gql } from '@apollo/client'
import { FieldFragment } from '../fragments/field'


export const CREATE_FIELD = gql`
  mutation FormSystemCreateField($input: FormSystemCreateFieldInput!) {
    formSystemCreateField(input: $input) {
      ...Field
    }
  }
  ${FieldFragment}
`
