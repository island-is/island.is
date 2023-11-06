import { defineMessages } from 'react-intl'

export const result = defineMessages({
  nextButtonText: {
    id: 'judicial.system.core:court_of_appeal.result.next_button_text',
    defaultMessage: 'Leiðrétta úrskurð',
    description:
      'Notaður sem texti í "Næsta" hnapp í úrskurðarferli héraðsdóms',
  },
  reopenCaseText: {
    id: 'judicial.system.core:court_of_appeal.reopen_case.text',
    defaultMessage:
      'Með því að halda áfram opnast ferlið aftur og hægt er að leiðrétta úrskurðinn. Til að breytingarnar skili sér til aðila máls þarf að ljúka málinu aftur.',
    description:
      'Notaður sem texti í modal til að opna mál aftur eftir úrskurð.',
  },
})
