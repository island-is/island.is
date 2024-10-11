import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:prosecutor.cases_awaiting_confirmation.title',
    defaultMessage: 'Ákærur sem bíða staðfestingar',
    description:
      'Notaður sem titill í málalista fyrir ákærur sem bíða staðfestingar',
  },
  noCasesTitle: {
    id: 'judicial.system.core:prosecutor.cases_awaiting_confirmation.no_cases_title',
    defaultMessage: 'Engin mál bíða staðfestingar',
    description: 'Notaður sem titill þegar engin mál eru til staðfestingar',
  },
  noCasesMessage: {
    id: 'judicial.system.core:prosecutor.cases_awaiting_confirmation.no_cases_message',
    defaultMessage: 'Engin mál hafa verið send til staðfestingar.',
    description: 'Notað sem skilaboð þegar engin mál eru til staðfestingar',
  },
})
