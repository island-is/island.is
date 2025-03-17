import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  keyDates: {
    id: 'judicial.system.core:blue_box_with_date.key_dates_v1',
    defaultMessage: 'Birting dóms',
    description: 'Notaður sem titill í lykildagsetningarsvæði dómfellda.',
  },
  defendantVerdictViewDateLabel: {
    id: 'judicial.system.core:blue_box_with_date.defendant_verdict_view_date_label',
    defaultMessage: 'Dagsetning birtingar',
    description:
      'Notaður sem titill í dagsetningarinnsláttarsvæði fyrir það hvenær dómur var birtur dómfellda.',
  },
  defendantVerdictViewDatePlaceholder: {
    id: 'judicial.system.core:blue_box_with_date.defendant_verdict_view_date_placeholder',
    defaultMessage: 'Veldu dagsetningu birtingar',
    description:
      'Notaður sem placeholder texti í dagsetningarinnsláttarsvæði fyrir það hvenær dómur var birtur dómfellda.',
  },
  defendantViewedVerdictInCourt: {
    id: 'judicial.system.core:blue_box_with_date.defendant_viewed_verdict_in_court',
    defaultMessage: 'Dómfelldi var viðstaddur dómsuppkvaðningu',
    description:
      'Notaður sem texti um að dómfelldi var viðstaddur dómsuppkvaðningu.',
  },
  defendantVerdictViewedDate: {
    id: 'judicial.system.core:blue_box_with_date.defendant_verdict_viewed_date',
    defaultMessage: 'Dómur birtur {date}',
    description: 'Notaður sem texti fyrir dagsetningu birtingar.',
  },
  defendantAppealDate: {
    id: 'judicial.system.core:blue_box_with_date.defendant_appeal_date',
    defaultMessage: 'Dómi áfrýjað {date}',
    description: 'Notaður sem texti fyrir dagsetningu áfrýjunar.',
  },
  defendantVerdictViewDateButtonText: {
    id: 'judicial.system.core:blue_box_with_date.defendant_verdict_view_date_button_text',
    defaultMessage: 'Skrá birtingu dóms',
    description:
      'Notaður sem text í takka til að skrá hvenær dómur var birtur dómfellda.',
  },
  defendantAppealDateLabel: {
    id: 'judicial.system.core:blue_box_with_date.defendant_appeal_date_label',
    defaultMessage: 'Dagsetning áfrýjunar',
    description:
      'Notaður sem titill í dagsetningarinnsláttarsvæði fyrir það hvenær dómur var áfrýjaður af dómfellda.',
  },
  defendantAppealDatePlaceholder: {
    id: 'judicial.system.core:blue_box_with_date.defendant_appeal_date_placeholder',
    defaultMessage: 'Veldu dagsetningu áfrýjunar',
    description:
      'Notaður sem placeholder í dagsetningarinnsláttarsvæði fyrir það hvenær dómur var áfrýjaður af dómfellda.',
  },
  defendantAppealDateButtonText: {
    id: 'judicial.system.core:blue_box_with_date.defendant_appeal_date_button_text',
    defaultMessage: 'Skrá áfrýjun ákærða',
    description:
      'Notaður sem text í takka til að skrá hvenær dómur var áfrýjaður af dómfellda.',
  },
  sendToPrisonAdmin: {
    id: 'judicial.system.core:blue_box_with_date.send_to_fmst',
    defaultMessage: 'Senda til fullnustu',
    description:
      'Notaður sem texti í valmynd fyrir aðgerðina að senda mál til fullnustu',
  },
  revokeSendToPrisonAdmin: {
    id: 'judicial.system.core:blue_box_with_date.revoke_send_to_fmst',
    defaultMessage: 'Afturkalla úr fullnustu',
    description:
      'Notaður sem texti í valmynd fyrir aðgerðina að senda mál til fullnustu',
  },
  sendToPrisonAdminDate: {
    id: 'judicial.system.core:blue_box_with_date.send_to_fmst_date',
    defaultMessage: 'Sent til fullnustu {date}',
    description:
      'Notaður sem texti í valmynd fyrir aðgerðina að senda mál til fullnustu',
  },
  indictmentRulingDecisionFine: {
    id: 'judicial.system.core:blue_box_with_date.indictment_ruling_decision_fine',
    defaultMessage: 'Viðurlagaákvörðun',
    description:
      'Notaður sem titill í svæði þar sem kærufrestur viðurlagaákvörðunar er tekinn fram',
  },
  fineAppealDeadline: {
    id: 'judicial.system.core:blue_box_with_date.fine_appeal_deadline',
    defaultMessage:
      'Kærufrestur Ríkissaksóknara {appealDeadlineIsInThePast, select, true {var} other {er}} til {appealDeadline}',
    description:
      'Notaður sem titill í svæði þar sem kærufrestur viðurlagaákvörðunar er tekinn fram',
  },
  revokeSendToPrisonAdminModalTitle: {
    id: 'judicial.system.core:blue_box_with_date.revoke_send_to_prison_admin_modal_title',
    defaultMessage: 'Afturkalla úr fullnustu',
    description: 'Notaður sem titill í "Afturkalla úr fullnustu" modal glugga.',
  },
  revokeSendToPrisonAdminModalText: {
    id: 'judicial.system.core:blue_box_with_date.revoke_send_to_prison_admin_modal_text',
    defaultMessage:
      'Mál {courtCaseNumber} verður afturkallað.\nÁkærði: {defendant}.',
    description: 'Notaður sem texti í "Afturkalla úr fullnustu" modal glugga.',
  },
  revoke: {
    id: 'judicial.system.core:blue_box_with_date.revoke',
    defaultMessage: 'Afturkalla',
    description: 'Notaður sem texti fyrir aðgerðina að afturkalla mál',
  },
  revokeAppeal: {
    id: 'judicial.system.core:blue_box_with_date.revoke_appeal',
    defaultMessage: 'Afturkalla áfrýjun',
    description: 'Notaður sem texti fyrir aðgerðina að afturkalla áfrýjun',
  },
})
