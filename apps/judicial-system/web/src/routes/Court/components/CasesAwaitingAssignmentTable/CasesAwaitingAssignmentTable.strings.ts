import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:court.cases_awaiting_assignment.title',
    defaultMessage: 'Bíða úthlutunar',
    description: 'Notaður sem titill í málalista',
  },
  noCasesTitle: {
    id: 'judicial.system.core:court.cases_awaiting_assignment.no_cases_title',
    defaultMessage: 'Öllum málum hefur verið úthlutað',
    description: 'Notaður sem titill þegar engin mál eru til úthlutunar',
  },
  noCasesMessage: {
    id: 'judicial.system.core:court.cases_awaiting_assignment.no_cases_message',
    defaultMessage: 'Engin mál til úthlutunar',
    description: 'Notað sem skilaboð þegar engin mál eru til úthlutunar',
  },
})
