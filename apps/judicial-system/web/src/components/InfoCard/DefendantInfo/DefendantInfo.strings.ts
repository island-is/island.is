import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  appealExpirationDate: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_expiration_date',
    defaultMessage: 'Áfrýjunarfrestur dómfellda er til {appealExpirationDate}',
    description: 'Notað til að birta áfrýjunarfrest dómfellda í ákæru.',
  },
  appealDateExpired: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_date_expired',
    defaultMessage: 'Áfrýjunarfrestur dómfellda var til {appealExpirationDate}',
    description:
      'Notað til að láta vita að áfrýjunarfrestur í ákæru er útrunninn.',
  },
  appealDateNotBegun: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_date_not_begun',
    defaultMessage: 'Áfrýjunarfrestur dómfellda er ekki hafinn',
    description:
      'Notaður til að láta vita að áfrýjunarfrestur dómfellda er ekki hafinn.',
  },
  defender: {
    id: 'judicial.system.core:info_card.defendant_info.defender',
    defaultMessage: 'Verjandi',
    description: 'Notað til að birta titil á verjanda í ákæru.',
  },
  verdictDisplayedDate: {
    id: 'judicial.system.core:info_card.defendant_info.verdict_displayed_date',
    defaultMessage: 'Dómur birtur {date}',
    description: 'Notað til að birta dagsetningu þegar dómur var birtur.',
  },
  noDefenderAssigned: {
    id: 'judicial.system.core:info_card.defendant_info.no_defender_assigned',
    defaultMessage: 'Ekki skráður',
    description:
      'Notað til að láta vita að enginn verjandi er skráður í ákæru.',
  },
})
