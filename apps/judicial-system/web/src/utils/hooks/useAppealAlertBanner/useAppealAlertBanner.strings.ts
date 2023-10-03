import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  appealDeadlineTitle: {
    id: 'judicial.system.core:appeal_alert_banner.appeal_deadline_title',
    defaultMessage:
      'Kærufrestur {isAppealDeadlineExpired, select, true {rann} other {rennur}} út {appealDeadline}',
    description: 'Texti í viðvörunarglugga um kærufrest',
  },
  appealLinkText: {
    id: 'judicial.system.core:appeal_alert_banner.appeal_link_text',
    defaultMessage: 'Senda inn kæru',
    description: 'Texti í hlekk í viðvörunarglugga um kærufrest',
  },
  appealCompletedTitle: {
    id: 'judicial.system.core:court_of_appeal_result.appeal_completed_title',
    defaultMessage: 'Niðurstaða Landsréttar {appealedDate}',
    description: 'Titill á niðurstöðu landsréttar á niðurstöðuskjá',
  },
  statementTitle: {
    id: 'judicial.system.core:appeal_alert_banner.statement_title',
    defaultMessage: 'Úrskurður kærður',
    description: 'Texti í viðvörunarglugga um að úrskurður hafi verið kærður',
  },
  statementDescription: {
    id: 'judicial.system.core:appeal_alert_banner.statement_description_v1',
    defaultMessage:
      '{appealedByProsecutor, select, true {Sækjandi} other {Verjandi}} kærði úrskurðinn {appealDate}',
    description: 'Texti í viðvörunarglugga um að úrskurður hafi verið kærður',
  },
  appealedInCourtStatementDescription: {
    id: 'judicial.system.core:appeal_alert_banner.appealed_in_court_statement_description',
    defaultMessage:
      '{appealedByProsecutor, select, true {Sækjandi} other {Varnaraðili}} kærði úrskurðinn í þinghaldi',
    description:
      'Texti í viðvörunarglugga um að úrskurður hafi verið kærður í þinghaldi',
  },
  statementLinkText: {
    id: 'judicial.system.core:appeal_alert_banner.statement_link_text',
    defaultMessage: 'Senda greinargerð',
    description:
      'Texti í hlekk í viðvörunarglugga til að senda greinargerð í kærumáli',
  },
  statementDeadlineDescription: {
    id: 'judicial.system.core:appeal_alert_banner.appeal_statement_deadline',
    defaultMessage:
      'Frestur til að skila greinargerð {isStatementDeadlineExpired, select, true {rann} other {rennur}} út {statementDeadline}',
    description: 'Texti í viðvörunarglugga um greinargerðarfrest í kærumálum',
  },
  statementSentDescription: {
    id: 'judicial.system.core:appeal_alert_banner.appeal_statement_sent',
    defaultMessage: 'Greinargerð send {statementSentDate}',
    description:
      'Texti í viðvörunarglugga sem birtir upplýsingar um hvenær greinargerð var send',
  },
  appealReceivedNotificationLinkText: {
    id: 'judicial.system.core:appeal_alert_banner.mark_appeal_received_link_text',
    defaultMessage: 'Senda tilkynningu um móttöku',
    description:
      'Texti á hlekk í viðvörunarglugga þar sem héraðsdómari getur móttekið kæru',
  },
  appealReceivedNotificationSent: {
    id: 'judicial.system.core:appeal_alert_banner.appeal_received_description',
    defaultMessage: 'Tilkynning um móttöku send {appealReceivedDate}',
    description:
      'Texti í viðvörunarglugga sem birtir upplýsingar um hvenær tilkynning um móttöku kæru var send',
  },
  decisionAccept: {
    id: 'judicial.system.core:appeal_alert_banner.decisionAccept',
    defaultMessage: 'Staðfesting',
    description:
      'Staðfesting á "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionRepeal: {
    id: 'judicial.system.core:appeal_alert_banner.decisionRepeal',
    defaultMessage: 'Fella úr gildi',
    description:
      'Fallið úr gildi í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionChanged: {
    id: 'judicial.system.core:appeal_alert_banner.decisionChanged',
    defaultMessage: 'Niðurstöðu breytt',
    description:
      'Niðurstöðu breytt í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionDismissedFromCourtOfAppeal: {
    id: 'judicial.system.core:appeal_alert_banner.decisionDismissedFromCourtOfAppeal',
    defaultMessage: 'Frávísun frá Landsrétti',
    description:
      'Frávísun frá Landsrétti í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionDismissedFromCourt: {
    id: 'judicial.system.core:appeal_alert_banner.decisionDismissedFromCourt',
    defaultMessage: 'Frávísun frá héraðsdómi',
    description:
      'Frávísun frá héraðsdómi í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionUnlabeling: {
    id: 'judicial.system.core:appeal_alert_banner.decisionUnlabeling',
    defaultMessage: 'Ómerking og heimvísun',
    description:
      'Ómerking og heimvísun í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  notifyCOATooltip: {
    id: 'judicial.system.core:appeal_alert_banner.notify_COA_tooltip',
    defaultMessage:
      'Tilkynning um móttöku kæru og frest til að skila greinargerð sendist á Landsrétt og aðila málsins',
    description:
      'Texti í tilkynningarglugga sem birtist þegar héraðsdómari er að fara að móttaka kæru.',
  },
})
