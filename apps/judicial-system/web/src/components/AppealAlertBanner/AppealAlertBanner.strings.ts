import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  appealTitle: {
    id: 'judicial.system.core:appeal_alert_banner.appeal_title',
    defaultMessage: 'Kærufrestur rennur út {appealDeadline}',
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
    description: 'Texti í viðvörunarglugga um að úrskurður hefur verið kærður',
  },
  statementDescription: {
    id: 'judicial.system.core:appeal_alert_banner.statement_description',
    defaultMessage: '{actor} hefur kært úrskurðinn {appealDate}',
    description: 'Texti í viðvörunarglugga um að úrskurður hefur verið kærður',
  },
  statementLinkText: {
    id: 'judicial.system.core:appeal_alert_banner.statement_link_text',
    defaultMessage: 'Senda greinargerð',
    description:
      'Texti í hlekk í viðvörunarglugga um að senda greinargerð í kærumáli',
  },
})
