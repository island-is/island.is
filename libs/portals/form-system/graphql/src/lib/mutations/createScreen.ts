import { gql } from '@apollo/client'
import { ScreenFragment } from '../fragments/screen'

export const CREATE_SCREEN = gql`
  mutation CreateFormSystemScreen($input: FormSystemCreateScreenInput!) {
    createFormSystemScreen(input: $input) {
      ...Screen
    }
  }
  ${ScreenFragment}
`
