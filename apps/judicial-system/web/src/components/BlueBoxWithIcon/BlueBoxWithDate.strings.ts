import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  defendantVerdictServiceDateLabel: {
    id: 'judicial.system.core:blue_box_with_date.defendant_verdict_service_date_label',
    defaultMessage: 'Dagsetning birtingar',
    description:
      'Notaður sem titill í dagsetningarinnsláttarsvæði fyrir það hvenær dómur var birtur dómfellda.',
  },
  defendantVerdictServiceDatePlaceholder: {
    id: 'judicial.system.core:blue_box_with_date.defendant_verdict_service_date_placeholder',
    defaultMessage: 'Veldu dagsetningu birtingar',
    description:
      'Notaður sem placeholder texti í dagsetningarinnsláttarsvæði fyrir það hvenær dómur var birtur dómfellda.',
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
  defendantVerdictServiceDateButtonText: {
    id: 'judicial.system.core:blue_box_with_date.defendant_verdict_service_date_button_text',
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
  sendToPrisonAdminDate: {
    id: 'judicial.system.core:blue_box_with_date.send_to_fmst_date',
    defaultMessage: 'Sent til fullnustu {date}',
    description:
      'Notaður sem texti í valmynd fyrir aðgerðina að senda mál til fullnustu',
  },
  fineAppealDeadline: {
    id: 'judicial.system.core:blue_box_with_date.fine_appeal_deadline',
    defaultMessage:
      'Kærufrestur Ríkissaksóknara {appealDeadlineIsInThePast, select, true {var} other {er}} til {appealDeadline}',
    description:
      'Notaður sem titill í svæði þar sem kærufrestur viðurlagaákvörðunar er tekinn fram',
  },
})
