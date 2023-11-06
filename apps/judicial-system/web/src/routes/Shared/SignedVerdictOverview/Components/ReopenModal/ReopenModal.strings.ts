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
})
