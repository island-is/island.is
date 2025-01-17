import { gql } from '@apollo/client'
import { ScreenFragment } from '../fragments/screen'

export const UPDATE_SCREEN = gql`
  mutation FormSystemUpdateScreen($input: FormSystemUpdateScreenInput!) {
    formSystemUpdateScreen(input: $input) {
      ...Screen
    }
  }
  ${ScreenFragment}
`
