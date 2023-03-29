import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  appealAlertBannerTitle: {
    id:
      'judicial.system.core:signed_verdict_overview.appeal_alert_banner_title',
    defaultMessage: 'Kærufrestur rennur út {appealDeadline}',
    description: 'Texti í viðvörunarglugga um kærufrest',
  },
  appealAlertBannerLinkText: {
    id:
      'judicial.system.core:signed_verdict_overview.appeal_alert_banner_link_text',
    defaultMessage: 'Senda inn kæru',
    description: 'Texti í hlekk í viðvörunarglugga um kærufrest',
  },
  nextButtonReopenText: {
    id: 'judicial.system.core:signed_verdict_overview.next_button_reopen_text',
    defaultMessage: 'Leiðrétta þingbók og úrskurð',
    description:
      'Notaður sem texti á next takka fyrir dómara og dómritara í yfirliti lokins máls.',
  },
  appealedAlertBannerTitle: {
    id:
      'judicial.system.core:signed_verdict_overview.appealed_alert_banner_title',
    defaultMessage:
      '{isAppealedByProsecutor, select, true {Sækjandi} other {Verjandi}} hefur kært úrskurðinn {appealDate}',
    description:
      'Texti í viðvörunarglugga á yfirlittskjá máls þegar mál hefur verið kært og hægt er að senda greinargerð',
  },
  appealedAlertBannerLinkText: {
    id:
      'judicial.system.core:signed_verdict_overview.appealed_alert_banner_link_text',
    defaultMessage: 'Senda greinargerð',
    description:
      'Texti í hlekk í viðvörunarglugga um greinargerð á yfirlittskjá máls',
  },
})
