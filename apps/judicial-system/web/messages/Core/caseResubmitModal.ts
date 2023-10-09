import { defineMessage, defineMessages } from 'react-intl'

export const caseResubmitModal = {
  heading: defineMessage({
    id: 'judicial.system.core:overview.case_resubmit_modal.heading',
    defaultMessage: 'Hverju var breytt?',
    description:
      'Notaður sem titill á modal sem birtist þegar móttekin krafa er endursend',
  }),
  text: defineMessage({
    id: 'judicial.system.core:overview.case_resubmit_modal.text_v2',
    defaultMessage:
      'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur.{requestSharedWithDefender, select, true { Bæði dómari og verjandi munu fá tilkynningu um að krafa hafi verið send aftur.} other {}}',
    description: 'Notaður sem texti í modal þegar móttekin krafa er endursend',
  }),
  primaryButtonText: defineMessage({
    id: 'judicial.system.core:overview.case_resubmit_modal.primary_button_text',
    defaultMessage: 'Endursenda kröfu',
    description:
      'Notaður sem texti í "Endursenda kröfu" takka í modal sem kemur þegar krafa er endursend',
  }),
  secondaryButtonText: defineMessage({
    id: 'judicial.system.core:overview.case_resubmit_modal.secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í "Hætta við" takka í modal sem kemur þegar krafa er endursend',
  }),
  input: defineMessages({
    label: {
      id: 'judicial.system.core:overview.case_resubmit_modal.input.label',
      defaultMessage: 'Hverju var breytt?',
      description:
        'Notaður sem titill í "Hverju var breytt?" textasvæði í modal sem kemur þegar krafa er endursend',
    },
    placeholder: {
      id: 'judicial.system.core:overview.case_resubmit_modal.input.placeholder',
      defaultMessage: 'Skrá hverju var breytt í kröfunni',
      description:
        'Notaður sem skýritexti í "Hverju var breytt?" textasvæði í modal sem kemur þegar krafa er endursend',
    },
  }),
}
