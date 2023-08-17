import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  resentCourtCaseFacts: {
    id: 'judicial.system.backend:case.resent_court_case_facts',
    defaultMessage: 'Í greinargerð sóknaraðila er atvikum lýst svo:',
    description:
      'Notaður sem texti þegar greinargerð sóknaraðila er uppfærð vegna endursendingar',
  },
  resentCourtLegalArguments: {
    id: 'judicial.system.backend:case.resent_court_legal_arguments',
    defaultMessage: 'Í greinargerð er krafa sóknaraðila rökstudd þannig:',
    description:
      'Notaður sem texti þegar krafa sóknaraðila er uppfærð vegna endursendingar',
  },
})
