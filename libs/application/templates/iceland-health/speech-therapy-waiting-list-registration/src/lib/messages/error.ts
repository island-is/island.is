import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  languageRequired: {
    id: 'stwlr.application:error.languageRequired',
    defaultMessage: 'Vinsamlegast veldu tungumál',
    description: 'Please select a language',
  },
  phoneNumber: {
    id: 'stwlr.application:error.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  noChildOnWaitingListTitle: {
    id: 'stwlr.application:error.noChildOnWaitingListTitle',
    defaultMessage: 'Ekkert barn bíður samþykkis',
    description: 'No child is awaiting approval',
  },
  noChildOnWaitingListSummary: {
    id: 'stwlr.application:error.noChildOnWaitingListSummary',
    defaultMessage:
      'Ekkert barn í þinni forsjá er á biðlista eftir talþjálfun og bíður samþykkis.',
    description:
      'No child in your custody is on the speech therapy waiting list awaiting approval.',
  },
  speechTherapistConfirmationRequired: {
    id: 'stwlr.application:error.speechTherapistConfirmationRequired',
    defaultMessage:
      'Vinsamlegast staðfestu að biðin getur verið lengri ef valinn er talmeinafræðingur',
    description:
      'Please confirm that the wait can be longer if a speech therapist is chosen',
  },
})
