import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  resendModalTitle: {
    id: 'judicial.system.core:court.indictments.resend_indictment_modal.title',
    defaultMessage: 'Endursenda ákæru',
    description: 'Notaður sem titill á endursendunar glugga.',
  },
  resendModalText: {
    id: 'judicial.system.core:court.indictments.resend_indictment_modal.text',
    defaultMessage:
      'Skráðu ástæðu fyrir endursendingu ákæru. Sækjandi fær skilaboð um endursendingu',
    description: 'Notaður sem texti í endursendunar glugga.',
  },
  resendModalPrimaryButtonText: {
    id: 'judicial.system.core:court.indictments.resend_indictment_modal.primary_button_text',
    defaultMessage: 'Endursenda ákæru',
    description: 'Notaður sem texti á endursenda takka í endursendunar glugga.',
  },
  resendModalSecondaryButtonText: {
    id: 'judicial.system.core:court.indictments.resend_indictment_modal.secondary_button_text',
    defaultMessage: 'Hætta við',
    description: 'Notaður sem texti á hætta við takka í endursendunar glugga.',
  },
  resendExplanationLabel: {
    id: 'judicial.system.core:court.indictments.resend_indictment_modal.explanation_label',
    defaultMessage: 'Hvers vegna er ákæran endursend?',
    description: 'Notaður sem titill á input boxi fyrir ástæðu endursendingar.',
  },
  resendExplanationPlaceholder: {
    id: 'judicial.system.core:court.indictments.resend_indictment_modal.explanation_placeholder',
    defaultMessage: 'Skrá ástæðu endursendingar',
    description:
      'Notaður sem skýritexti í input boxi fyrir ástæðu endursendingar.',
  },
  prependedResentExplanation: {
    id: 'judicial.system.core:court.indictments.resend_indictment_modal.prepended_resent_explanation',
    defaultMessage: '{date} - {name} héraðsdómari, {courtName}.',
    description: 'Notaður sem texti fyrir framan ástæðu endursendingar.',
  },
})
