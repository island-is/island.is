import { defineMessages } from 'react-intl'

export const m = defineMessages({
  fetchAppealsFailedTitle: {
    id: 'web.landsretturCourtOfAppealAppeals:fetchAppealsFailedTitle',
    defaultMessage: 'Ekki tókst að sækja áfrýjuð mál',
    description: 'Error title when fetching court of appeal appeals fails',
  },
  fetchAppealsFailedMessage: {
    id: 'web.landsretturCourtOfAppealAppeals:fetchAppealsFailedMessage',
    defaultMessage: 'Villa kom upp við að sækja áfrýjuð mál',
    description: 'Error message when fetching court of appeal appeals fails',
  },
})
