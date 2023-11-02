import { defineMessages } from 'react-intl'

export const history = {
  general: defineMessages({
    onSubmit: {
      id: 'crc.application:history.general.onSubmit',
      defaultMessage: 'Umsókn stofnuð.',
      description: 'Application history on submit',
    },
    onCounterPartyApprove: {
      id: 'crc.application:history.general.onCounterPartyApprove',
      defaultMessage: 'Umsókn samþykkt af gagnaðila.',
      description: 'Application history on counterparty approve',
    },
    onCounterPartyReject: {
      id: 'crc.application:history.general.onCounterPartyReject',
      defaultMessage: 'Umsókn hafnað af gagnaðila.',
      description: 'Application history on counterparty reject',
    },
    onCommissionerReject: {
      id: 'crc.application:history.general.onCommissionerReject',
      defaultMessage: 'Umsókn hafnað af sýslumanni.',
      description: 'Application history on commissioner reject',
    },
    onCommissionerApprove: {
      id: 'crc.application:history.general.onCommisionerApprove',
      defaultMessage: 'Umsókn samþykkt af sýslumanni.',
      description: 'Application history on commissioner approve',
    },
  }),
  actions: defineMessages({
    waitingForUserActionTitle: {
      id: 'crc.application:history.actions.waitingForUserActionTitle',
      defaultMessage: 'Beðið eftir gagnaðila',
      description: 'Application history pending action from user title',
    },
    waitingForUserActionDescription: {
      id: 'crc.application:history.actions.waitingForUserActionDescription',
      defaultMessage:
        'Umsókn bíður nú eftir að þú lesir yfir og samþykkir samninginn.',
      description: 'Application history pending action from user description',
    },
    waitingForCounterpartyDescription: {
      id: 'crc.application:history.actions.waitingForCounterpartyDescription',
      defaultMessage:
        'Umsókn bíður nú eftir að hitt forsjárforeldrið lesi yfir og samþykki samninginn.',
      description:
        'Application history pending action from counterparty description',
    },
    waitingForOrganizationTitle: {
      id: 'crc.application:history.actions.waitingForOrganizationTitle',
      defaultMessage: 'Beðið eftir sýslumanni.',
      description: 'Application history waiting for organization title',
    },
  }),
}
