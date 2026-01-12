import { gql } from '@apollo/client'
import { ScreenFragment } from '../fragments/screen'

export const UPDATE_SCREEN = gql`
  mutation UpdateFormSystemScreen($input: FormSystemUpdateScreenInput!) {
    updateFormSystemScreen(input: $input) {
      ...Screen
    }
  }
  ${ScreenFragment}
`
