import { defineMessage, defineMessages } from 'react-intl'

export const rcOverview = {
  receivedAlert: defineMessages({
    title: {
      id: 'judicial.system.restriction_cases:overview.received_alert.title',
      defaultMessage: 'Athugið',
      description:
        'Notaður sem titill í upplýsingarboxi á yfirlits skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    message: {
      id: 'judicial.system.restriction_cases:overview.received_alert.message',
      defaultMessage:
        'Hægt er að breyta efni kröfunnar og bæta við rannsóknargögnum eftir að hún hefur verið send dómstól en til að breytingar skili sér í dómskjalið sem verður til hliðsjónar í þinghaldinu þarf að smella á Endursenda kröfu á skjánum Yfirlit kröfu.',
      description:
        'Notaður sem skilaboð í upplýsingarboxi á yfirlits skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
  }),
  openedByDefenderAlert: defineMessages({
    title: {
      id: 'judicial.system.restriction_cases:overview.opened_by_defender_alert.title',
      defaultMessage: 'Mál opnað af verjanda',
      description:
        'Notaður sem titill fyrir "Mál opnað af verjanda" hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
    },
    text: {
      id: 'judicial.system.restriction_cases:overview.opened_by_defender_alert.text',
      defaultMessage: 'Verjandi hefur opnað málið í Réttarvörslugátt {when}.',
      description:
        'Notaður sem titill fyrir "Mál opnað af verjanda" hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
    },
  }),
  headingV3: defineMessage({
    id: 'judicial.system.restriction_cases:overview.heading_v3',
    defaultMessage:
      'Yfirlit kröfu um {caseType, select, ADMISSION_TO_FACILITY {{isExtended, select, true {framlengingu á } other {}}vistun á viðeigandi stofnun} TRAVEL_BAN {{isExtended, select, true {farbanni} other {farbann}}} other {{isExtended, select, true {framlengingu á gæsluvarðhaldi} other {gæsluvarðhald}}}}',
    description: 'Notaður sem titill á yfirlits skrefi í rannsóknarheimildum.',
  }),
  sections: {
    modal: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:overview.modal.heading',
        defaultMessage: 'Krafa um {caseType} hefur verið send til dómstóls',
        description:
          'Notaður sem titill á modal sem birtist þegar krafa hefur verið send til dómstóls',
      },
      headingV2: {
        id: 'judicial.system.restriction_cases:overview.modal.heading_v2',
        defaultMessage:
          'Krafa um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbann} other {gæsluvarhald}} hefur verið send til dómstóls',
        description:
          'Notaður sem titill á modal sem birtist þegar krafa hefur verið send til dómstóls',
      },
      notificationSent: {
        id: 'judicial.system.restriction_cases:overview.modal.notification_sent',
        defaultMessage:
          'Tilkynning hefur verið send á dómara og dómritara á vakt.\n\nÞú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
        description:
          'Notaður sem texti í modal þegar tilkynning hefur verið send til dómara og dómritara á vakt',
      },
      notificationNotSent: {
        id: 'judicial.system.restriction_cases:overview.modal.notification_not_sent',
        defaultMessage:
          'Ekki tókst að senda tilkynningu á dómara og dómritara á vakt.\n\nÞú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
        description:
          'Notaður sem texti í modal þegar ekki tókst að senda tilkynningu til dómara og dómritara á vakt',
      },
    }),
  },
}
