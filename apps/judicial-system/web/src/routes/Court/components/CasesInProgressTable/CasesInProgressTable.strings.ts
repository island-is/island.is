import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:court.cases_in_progress.title',
    defaultMessage: 'Mál í vinnslu',
    description: 'Notaður sem titill í málalista',
  },
  noCasesTitle: {
    id: 'judicial.system.core:court.cases_in_progress.no_cases_title',
    defaultMessage: 'Engin mál í vinnslu.',
    description: 'Notaður sem titill þegar engin mál eru til vinnslu',
  },
  noCasesMessage: {
    id: 'judicial.system.core:court.cases_in_progress.no_cases_message',
    defaultMessage: 'Öll mál hafa verið afgreidd.',
    description: 'Notað sem skilaboð þegar engin mál eru til vinnslu',
  },
  cancelCaseModalTitle: {
    id: 'judicial.system.core:cases.active_requests.cancel_case_modal_title',
    defaultMessage: 'Mál afturkallað',
    description: 'Notaður sem titill í Afturkalla mál dómstóla modal.',
  },
  cancelCaseModalText: {
    id: 'judicial.system.core:cases.active_requests.cancel_case_modal_text',
    defaultMessage:
      'Ákæruvaldið hefur afturkallað ákæruna. Hægt er að skrá málsnúmer og ljúka málinu hér.',
    description: 'Notaður sem texti í Afturkalla mál dómstóla modal.',
  },
  cancelCaseModalPrimaryButtonText: {
    id: 'judicial.system.core:cases.active_requests.cancel_case_modal_primary_button_text',
    defaultMessage: 'Ljúka máli',
    description:
      'Notaður sem texti á Ljúka máli takka í Afturkalla mál dómstóla modal.',
  },
  cancelCaseModalSecondaryButtonText: {
    id: 'judicial.system.core:cases.active_requests.delete_case_modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti á Hætta við takka í Afturkalla mál dómstóla modal.',
  },
})
