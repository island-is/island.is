import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.title',
    defaultMessage: 'Máli lokið',
    description: 'Notaður sem titill á yfirliti ákæru.',
  },
  reviewerLabel: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_label',
    defaultMessage: 'Veldu saksóknara',
    description: 'Notaður sem texti fyrir úthlutun til yfirlestrar dropdown.',
  },
  reviewerPlaceholder: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_placeholder',
    defaultMessage: 'Velja saksóknara',
    description: 'Notaður sem skýritexti í dropdown til að velja dómara.',
  },
  reviewerTitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.dropdown_title',
    defaultMessage: 'Úthlutun til yfirlestrar',
    description: 'Notaður sem titill á yfirliti ákæru.',
  },
  reviewerSubtitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_subtitle_v2',
    defaultMessage:
      'Frestur til að {isFine, select, true {kæra viðurlagaákvörðun} other {áfrýja dómi}} {appealDeadlineIsInThePast, select, true {rann} other {rennur}} út {indictmentAppealDeadline}',
    description: 'Notaður sem undirtitill á yfirliti ákæru.',
  },
  reviewerAssignedModalTitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_assigned_modal_title',
    defaultMessage: 'Úthlutun tókst',
    description: 'Notaður sem titill á tilkynningaglugga um yfirlesara.',
  },
  reviewerAssignedModalText: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_assigned_modal_text',
    defaultMessage:
      'Máli {caseNumber} hefur verið úthlutað til yfirlestrar á {reviewer}.',
    description: 'Notaður sem texti í tilkynningaglugga um yfirlesara.',
  },
  changeReviewedDecisionButtonText: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.change_reviewed_decision_button_text',
    defaultMessage: 'Breyta ákvörðun',
    description:
      'Notaður sem texti fyrir staðfestingartakka þegar ákvörðun ríkissaksóknara er breytt.',
  },
  revokeAppeal: {
    id: 'judicial.system.core:public_prosecutor.indictments.revoke_appeal',
    defaultMessage: 'Afturkalla áfrýjun',
    description: 'Notaður sem texti fyrir aðgerðina að afturkalla áfrýjun',
  },
  revokeSendToPrisonAdmin: {
    id: 'judicial.system.core:public_prosecutor.indictments.revoke_send_to_fmst',
    defaultMessage: 'Afturkalla úr fullnustu',
    description:
      'Notaður sem texti í valmynd fyrir aðgerðina að senda mál til fullnustu',
  },
  sendToPrisonAdmin: {
    id: 'judicial.system.core:public_prosecutor.indictment.send_to_fmst',
    defaultMessage: 'Senda til fullnustu',
    description:
      'Notaður sem texti í valmynd fyrir aðgerðina að senda mál til fullnustu',
  },
  revokeSendToPrisonAdminModalTitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.revoke_send_to_prison_admin_modal_title',
    defaultMessage: 'Afturkalla úr fullnustu',
    description: 'Notaður sem titill í "Afturkalla úr fullnustu" modal glugga.',
  },
  revokeSendToPrisonAdminModalText: {
    id: 'judicial.system.core:public_prosecutor.indictments.revoke_send_to_prison_admin_modal_text',
    defaultMessage:
      'Mál {courtCaseNumber} verður afturkallað.\nÁkærði: {defendant}.',
    description: 'Notaður sem texti í "Afturkalla úr fullnustu" modal glugga.',
  },
  revoke: {
    id: 'judicial.system.core:public_prosecutor.indictments.revoke',
    defaultMessage: 'Afturkalla',
    description: 'Notaður sem texti fyrir aðgerðina að afturkalla mál',
  },
})
