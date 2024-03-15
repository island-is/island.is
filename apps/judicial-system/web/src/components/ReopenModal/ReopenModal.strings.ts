import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:reopen_modal.title',
    defaultMessage: 'Viltu lagfæra úrskurðinn?',
    description:
      'Notaður sem titill á modal til að opna mál aftur eftir úrskurð.',
  },

  continue: {
    id: 'judicial.system.core:reopen_modal.continue',
    defaultMessage: 'Halda áfram',
    description:
      'Notaður sem texti á halda áfram takka í modal til að opna mál aftur eftir úrskurð.',
  },
  cancel: {
    id: 'judicial.system.core:reopen_modal.cancel',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti á hætta við takka í modal til að opna mál aftur eftir úrskurð.',
  },
  reopenCaseText: {
    id: 'judicial.system.core:reopen_modal.reopen_case_text',
    defaultMessage:
      'Með því að halda áfram fellur núverandi undirritun úr gildi og dómari þarf að undirrita aftur eftir leiðréttingu.',
    description:
      'Notaður sem texti í modal til að opna mál aftur eftir úrskurð.',
  },
  reopenAppealText: {
    id: 'judicial.system.core:reopen_modal.reopen_appeal_text',
    defaultMessage:
      'Með því að halda áfram opnast ferlið aftur og hægt er að leiðrétta úrskurðinn. Til að breytingarnar skili sér til aðila máls þarf að ljúka málinu aftur.',
    description:
      'Notaður sem texti í modal til að opna kært mál aftur eftir úrskurð.',
  },
})
