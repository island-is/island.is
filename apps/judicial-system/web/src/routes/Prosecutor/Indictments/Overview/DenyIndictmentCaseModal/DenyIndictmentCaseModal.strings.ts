import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.indictments:overview.deny_indictment_case_modal.title',
    defaultMessage: 'Hafna ákæru',
    description: 'Titill á hafna ákæru modal',
  },
  text: {
    id: 'judicial.system.indictments:overview.deny_indictment_case_modal.text',
    defaultMessage:
      'Skráðu ástæðu þess að ákæru er hafnað. Ákærandi fær skilaboð um endursendingu ákæru og ástæðu höfnunar.',
    description: 'Lýsingartexti á hafna ákæru modal.',
  },
  denyAndReturnToProsecutor: {
    id: 'judicial.system.indictments:overview.deny_indictment_case_modal.return_to_prosecutor',
    defaultMessage: 'Senda aftur til ákæranda',
    description: 'Texti á Senda aftur til ákæranda takka á hafna ákæru modal.',
  },
  explanationLabel: {
    id: 'judicial.system.indictments:overview.deny_indictment_case_modal.explanation_label',
    defaultMessage: 'Ástæða höfnunar',
    description: 'Label á input boxi fyrir ástæði höfnunar á ákæru.',
  },
  explanationPlaceholder: {
    id: 'judicial.system.indictments:overview.deny_indictment_case_modal.explanation_placeholder',
    defaultMessage: 'Hver er ástæða höfnunar?',
    description: 'Texti í input boxi fyrir ástæðu höfnunar á ákæru.',
  },
  stopModal: {
    id: 'judicial.system.core:stop_modal',
    defaultMessage: 'Hætta við',
    description: 'Notaður fyrir texta í Hætta við takka í modölum.',
  },
})
