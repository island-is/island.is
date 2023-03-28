import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  appealAlertBannerTitle: {
    id:
      'judicial.system.core:signed_verdict_overview.appeal_alert_banner_title',
    defaultMessage: 'Kærufrestur rennur út {appealDeadline}',
    description: 'Texti í viðvörunarglugga um kærufrest',
  },
  statementAlertBannerTitle: {
    id: 'judicial.system.core:statement_alert_banner_title',
    defaultMessage: 'Úrskurður kærður',
    description: 'Texti í viðvörunarglugga um að úrskurður hefur verið kærður',
  },
  statementAlertBannerMessage: {
    id: 'judicial.system.core:statement_alert_banner_message',
    defaultMessage: '{actor} hefur kært úrskurðinn {appealDate}',
    description: 'Texti í viðvörunarglugga um að úrskurður hefur verið kærður',
  },
  appealAlertBannerLinkText: {
    id:
      'judicial.system.core:signed_verdict_overview.appeal_alert_banner_link_text',
    defaultMessage: 'Senda inn kæru',
    description: 'Texti í hlekk í viðvörunarglugga um kærufrest',
  },
  statementAlertBannerLinkText: {
    id:
      'judicial.system.core:signed_verdict_overview.statement_alert_banner_link_text',
    defaultMessage: 'Senda greinagerð',
    description:
      'Texti í hlekk í viðvörunarglugga um að senda greinagerð í kærumáli',
  },
  nextButtonReopenText: {
    id: 'judicial.system.core:signed_verdict_overview.next_button_reopen_text',
    defaultMessage: 'Leiðrétta þingbók og úrskurð',
    description:
      'Notaður sem texti á next takka fyrir dómara og dómritara í yfirliti lokins máls.',
  },
})
