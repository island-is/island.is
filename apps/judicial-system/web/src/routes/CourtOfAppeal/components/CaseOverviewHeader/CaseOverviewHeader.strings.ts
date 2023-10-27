import { defineMessages } from 'react-intl'

export const courtOfAppealCaseOverviewHeader = defineMessages({
  appealResultOpenedBy: {
    id: 'judicial.system.core:court_of_appeal.case_overview_header.appeal_result_opened_by',
    defaultMessage:
      '{userRole, select, DEFENDER {Verjandi} PROSECUTOR {Sækjandi} PRISON_SYSTEM_STAFF {Fangelsið Hólmsheiði} other {Notandi}} hefur opnað yfirlit máls í Réttarvörslugátt {when}',
    description:
      'Notað í alert skilaboðum á Landsréttar yfirliti þegar verjandi/sækjandi/fangelsi hefur opnað málið eftir niðurstöðu.',
  },
})
