import { gql } from '@apollo/client'
import { ScreenFragment } from '../fragments/screen'

export const NOTIFY_EXTERNAL_SERVICE = gql`
  mutation NotifyFormSystemExternalSystem(
    $input: FormSystemNotificationInput!
  ) {
    notifyFormSystemExternalSystem(input: $input) {
      screen {
        ...Screen
      }
    }
  }
  ${ScreenFragment}
`
