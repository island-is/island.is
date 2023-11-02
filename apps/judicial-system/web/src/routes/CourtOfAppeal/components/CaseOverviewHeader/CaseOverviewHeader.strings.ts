import { defineMessages } from 'react-intl'

export const courtOfAppealCaseOverviewHeader = defineMessages({
  appealedBy: {
    id: 'judicial.system.core:court_of_appeal.case_overview_header.appealed_by',
    defaultMessage:
      'Kært af {appealedByProsecutor, select, true {sækjanda} other {verjanda}} {appealedDate}',
    description:
      'Notaður sem texti fyrir "Kært af" á yfirlitsskjá mála hjá Landsrétti.',
  },
  appealedByInCourt: {
    id: 'judicial.system.core:court_of_appeal.case_overview_header.appealed_by_in_court',
    defaultMessage:
      '{appealedByProsecutor, select, true {Sækjandi} other {Varnaraðili}} kærði í þinghaldi',
    description:
      'Notaður sem texti fyrir "kærði í þinghaldi" á yfirlitsskjá mála hjá Landsrétti.',
  },
  appealResultOpenedBy: {
    id: 'judicial.system.core:court_of_appeal.case_overview_header.appeal_result_opened_by',
    defaultMessage:
      '{userRole, select, DEFENDER {Verjandi} PROSECUTOR {Sækjandi} PRISON_SYSTEM_STAFF {Fangelsið Hólmsheiði} other {Notandi}} hefur opnað yfirlit máls í Réttarvörslugátt {when}',
    description:
      'Notað í alert skilaboðum á Landsréttar yfirliti þegar verjandi/sækjandi/fangelsi hefur opnað málið eftir niðurstöðu.',
  },
  appealSentAfterDeadline: {
    id: 'judicial.system.core:court_of_appeal.case_overview_header.appeal_sent_after_deadline',
    defaultMessage: 'Kæra barst að kærufresti liðnum',
    description:
      'Notaður sem texti fyrir "Kæra barst að kærufresti liðnum" á yfirlitsskjá mála hjá Landsrétti.',
  },
})
