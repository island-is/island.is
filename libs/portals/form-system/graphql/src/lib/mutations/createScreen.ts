import { gql } from '@apollo/client'
import { ScreenFragment } from '../fragments/screen'


export const CREATE_SCREEN = gql`
  mutation FormSystemCreateScreen($input: FormSystemCreateScreenInput!) {
    formSystemCreateScreen(input: $input) {
      ...Screen
    }
  }
  ${ScreenFragment}
`
