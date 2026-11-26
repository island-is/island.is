import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  languageRequired: {
    id: 'stwlr.application:error.languageRequired',
    defaultMessage: 'Vinsamlegast veldu tungumál',
    description: 'Please select a language',
  },
  locationRequired: {
    id: 'stwlr.application:error.locationRequired',
    defaultMessage: 'Vinsamlegast veldu staðsetningu',
    description: 'Please select a location',
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
  optionsUnavailableTitle: {
    id: 'stwlr.application:error.optionsUnavailableTitle',
    defaultMessage: 'Ekki tókst að sækja gögn',
    description: 'Could not fetch data',
  },
  languagesUnavailableSummary: {
    id: 'stwlr.application:error.languagesUnavailableSummary',
    defaultMessage:
      'Engin tungumál fundust hjá Sjúkratryggingum. Vinsamlegast reyndu aftur síðar.',
    description:
      'No languages were found at Icelandic Health Insurance. Please try again later.',
  },
  locationsUnavailableSummary: {
    id: 'stwlr.application:error.locationsUnavailableSummary',
    defaultMessage:
      'Engar staðsetningar fundust hjá Sjúkratryggingum. Vinsamlegast reyndu aftur síðar.',
    description:
      'No locations were found at Icelandic Health Insurance. Please try again later.',
  },
  speechTherapistConfirmationRequired: {
    id: 'stwlr.application:error.speechTherapistConfirmationRequired',
    defaultMessage:
      'Vinsamlegast staðfestu að biðin getur verið lengri ef valinn er talmeinafræðingur',
    description:
      'Please confirm that the wait can be longer if a speech therapist is chosen',
  },
})
