import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  appealExpirationDate: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_expiration_date_v2',
    defaultMessage: '{deadlineType} dómfellda er til {appealExpirationDate}',
    description: 'Notað til að birta frest dómfellda í ákæru.',
  },
  appealDateExpired: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_date_expired_v2',
    defaultMessage: '{deadlineType} dómfellda var til {appealExpirationDate}',
    description: 'Notað til að láta vita að frestur í ákæru er útrunninn.',
  },
  appealDateNotBegun: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_date_not_begun_v2',
    defaultMessage: '{deadlineType} dómfellda er ekki hafinn',
    description:
      'Notaður til að láta vita að frestur dómfellda er ekki hafinn.',
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
  serviceNotRequired: {
    id: 'judicial.system.core:info_card.defendant_info.service_not_required',
    defaultMessage: 'Birting dóms ekki þörf',
    description: 'Notað sem texti þegar birting dóms er ekki þörf',
  },
  serviceRequired: {
    id: 'judicial.system.core:info_card.defendant_info.service_required_v1',
    defaultMessage: 'Birta skal dómfellda dóminn',
    description: 'Notað sem texti þegar birting dóms er þörf',
  },
  spokesperson: {
    id: 'judicial.system.core:info_card.spokesperson',
    defaultMessage: 'Talsmaður',
    description: 'Notaður sem titill á "talsmanni" á upplýsingaspjaldi máls.',
  },
  noDefender: {
    id: 'judicial.system.core:info_card.no_defender',
    defaultMessage: 'Hefur ekki verið skráður',
    description: 'Notaður sem texti þegar enginn verjandi er skráður.',
  },
  sendToPrisonAdminDate: {
    id: 'judicial.system.core:info_card.send_to_prison_admin_date',
    defaultMessage: 'Sent til fullnustu {date}',
    description: 'Notaður sem texti fyrir hvenær mál var sent til fullnustu',
  },
})
