import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  heading: {
    id: 'judicial.system.core:case_resubmit_modal.heading',
    defaultMessage: 'Hverju var breytt?',
    description:
      'Notaður sem titill á modal sem birtist þegar móttekin krafa er endursend',
  },
  text: {
    id: 'judicial.system.core:case_resubmit_modal.text',
    defaultMessage:
      'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur.{requestSharedWithDefender, select, true { Bæði dómari og verjandi munu fá tilkynningu um að krafa hafi verið send aftur.} other {}}',
    description: 'Notaður sem texti í modal þegar móttekin krafa er endursend',
  },
  primaryButtonText: {
    id: 'judicial.system.core:case_resubmit_modal.primary_button_text',
    defaultMessage: 'Endursenda',
    description:
      'Notaður sem texti í "Endursenda" takka í modal sem kemur þegar krafa er endursend',
  },
  secondaryButtonText: {
    id: 'judicial.system.core:case_resubmit_modal.secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í "Hætta við" takka í modal sem kemur þegar krafa er endursend',
  },
  inputLabel: {
    id: 'judicial.system.core:case_resubmit_modal.input_label',
    defaultMessage: 'Hverju var breytt?',
    description:
      'Notaður sem titill í "Hverju var breytt?" textasvæði í modal sem kemur þegar krafa er endursend',
  },
  inputPlaceholder: {
    id: 'judicial.system.core:case_resubmit_modal.input_placeholder',
    defaultMessage: 'Skrá hverju var breytt í kröfunni',
    description:
      'Notaður sem skýritexti í "Hverju var breytt?" textasvæði í modal sem kemur þegar krafa er endursend',
  },
})
