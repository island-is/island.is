import { gql } from '@apollo/client'
import { FormFragment } from '../fragments/form'

export const CREATE_SCREEN = gql`
  mutation FormSystemCreateScreen($input: FormSystemCreateScreenInput!) {
    formSystemCreateScreen(input: $input) {
      ...Form
    }
  }
  ${FormFragment}
`
