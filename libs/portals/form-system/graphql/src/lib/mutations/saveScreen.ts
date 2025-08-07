import { gql } from '@apollo/client'
import { ScreenFragment } from '../fragments/screen'

export const SAVE_SCREEN = gql`
  mutation SaveFormSystemScreen($input: SubmitFormSystemScreenInput!) {
    saveFormSystemScreen(input: $input) {
      ...Screen
    }
  }
  ${ScreenFragment}
`
