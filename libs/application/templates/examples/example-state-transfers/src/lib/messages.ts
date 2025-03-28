import { defineMessages } from 'react-intl'

export const m = defineMessages({
  hnippNote: {
    id: 'est.application:hnippNote',
    defaultMessage:
      'NOTE: The hnipp notification does not work locally unless you start up all the needed services, you need to test the application on dev/staging to see the notification.',
    description: 'Note about the Hnipp notification',
  },
  deadEnd: {
    id: 'est.application:deadEnd',
    defaultMessage:
      'This state is a dead end in the state machine and the application can not be moved out of this state.',
    description: 'Note about the dead end state',
  },
})
