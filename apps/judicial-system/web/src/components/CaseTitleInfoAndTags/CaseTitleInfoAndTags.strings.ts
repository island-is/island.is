import { defineMessages } from 'react-intl'

export const CaseTitleInfoAndTags = defineMessages({
  appealedBy: {
    id: 'judicial.system.core:case_overview_header.appealed_by',
    defaultMessage:
      'Kært af {appealedByProsecutor, select, true {sækjanda} other {verjanda}} {appealedDate}',
    description:
      'Notaður sem texti fyrir "Kært af" á yfirlitsskjá mála hjá Landsrétti.',
  },
  appealedByInCourt: {
    id: 'judicial.system.core:case_overview_header.appealed_by_in_court',
    defaultMessage:
      '{appealedByProsecutor, select, true {Sækjandi} other {Varnaraðili}} kærði í þinghaldi',
    description:
      'Notaður sem texti fyrir "kærði í þinghaldi" á yfirlitsskjá mála hjá Landsrétti.',
  },
  appealReceivedAt: {
    id: 'judicial.system.core:case_overview_header.appeal_alert_banner.appeal_received_at',
    defaultMessage: 'Tilkynning um móttöku send {appealReceived}',
    description:
      'Texti í viðvörunarglugga sem birtir upplýsingar um hvenær kæra var móttekin',
  },
  COAAppealReceivedAt: {
    id: 'judicial.system.core:case_overview_header.appeal_alert_banner.COA_appeal_received_at',
    defaultMessage: 'Kæra barst Landsrétti {appealReceived}',
    description:
      'Texti í viðvörunarglugga sem birtir upplýsingar um hvenær kæra var móttekin',
  },
  caseCompletedDatePrefix: {
    id: 'judicial.system.core:case_overview_header.case_completed_date_prefix',
    defaultMessage: 'Máli lokið',
    description: 'Notaður sem texti fyrir "Máli lokið" á yfirlitsskjá mála.',
  },
})
