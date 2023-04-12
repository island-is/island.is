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
  statementTitle: {
    id: 'judicial.system.core:appeal_alert_banner.statement_title',
    defaultMessage: 'Úrskurður kærður',
    description: 'Texti í viðvörunarglugga um að úrskurður hafi verið kærður',
  },
  statementDescription: {
    id: 'judicial.system.core:appeal_alert_banner.statement_description',
    defaultMessage: '{actor} hefur kært úrskurðinn {appealDate}',
    description: 'Texti í viðvörunarglugga um að úrskurður hafi verið kærður',
  },
  appealedInCourtStatementDescription: {
    id:
      'judicial.system.core:appeal_alert_banner.appealed_in_court_statement_description',
    defaultMessage: '{actor} kærði úrskurðinn í þinghaldi',
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
    id:
      'judicial.system.core:appeal_alert_banner.mark_appeal_received_link_text',
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
})
