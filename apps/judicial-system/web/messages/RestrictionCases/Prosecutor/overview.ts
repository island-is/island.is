import { CaseType } from '@island.is/judicial-system/types'
import { defineMessage, defineMessages } from 'react-intl'

export const rcOverview = {
  heading: defineMessage({
    id: 'judicial.system.restriction_cases:overview.heading',
    defaultMessage: 'Yfirlit kröfu um {caseType}',
    description: 'Notaður sem titill á yfirlits skrefi í rannsóknarheimildum.',
  }),
  headingV2: defineMessage({
    id: 'judicial.system.restriction_cases:overview.heading',
    defaultMessage: `Yfirlit kröfu um {caseType, select,
      ${CaseType.ADMISSION_TO_FACILITY} {{isExtended, select, yes {framlengingu á } other {}}vistun á viðeigandi stofnun}
      ${CaseType.TRAVEL_BAN} {{isExtended, select, yes {farbanni} other {farbann}}}
      other {isExtended, select, yes {framlengingu á gæsluvarðhaldi} other {gæsluvarðhald}}}`,
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
        defaultMessage: `Krafa um {caseType, select,
          ${CaseType.ADMISSION_TO_FACILITY} {vistun á viðeigandi stofnun}
          ${CaseType.TRAVEL_BAN} {farbann}
          other {gæsluvarhald}} hefur verið send til dómstóls`,
        description:
          'Notaður sem titill á modal sem birtist þegar krafa hefur verið send til dómstóls',
      },
      notificationSent: {
        id:
          'judicial.system.restriction_cases:overview.modal.notification_sent',
        defaultMessage:
          'Tilkynning hefur verið send á dómara og dómritara á vakt.\n\nÞú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
        description:
          'Notaður sem texti í modal þegar tilkynning hefur verið send til dómara og dómritara á vakt',
      },
      notificationNotSent: {
        id:
          'judicial.system.restriction_cases:overview.modal.notification_not_sent',
        defaultMessage:
          'Ekki tókst að senda tilkynningu á dómara og dómritara á vakt.\n\nÞú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
        description:
          'Notaður sem texti í modal þegar ekki tókst að senda tilkynningu til dómara og dómritara á vakt',
      },
    }),
    caseResentModal: {
      heading: defineMessage({
        id:
          'judicial.system.restriction_cases:overview.case_resent_modal.heading',
        defaultMessage: 'Hverju var breytt?',
        description:
          'Notaður sem titill á modal sem birtist þegar móttekin krafa er endursend',
      }),
      text: defineMessage({
        id: 'judicial.system.restriction_cases:overview.case_resent_modal.text',
        defaultMessage:
          'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur.',
        description:
          'Notaður sem texti í modal þegar móttekin krafa er endursend',
      }),
      primaryButtonText: {
        id:
          'judicial.system.restriction_cases:overview.case_resent_modal.primary_button_text',
        defaultMessage: 'Endursenda kröfu',
        description:
          'Notaður sem texti í "Endursenda kröfu" takka í modal sem kemur þegar krafa er endursend',
      },
      secondaryButtonText: {
        id:
          'judicial.system.restriction_cases:overview.case_resent_modal.secondary_button_text',
        defaultMessage: 'Hætta við',
        description:
          'Notaður sem texti í "Hætta við" takka í modal sem kemur þegar krafa er endursend',
      },
      input: {
        label: defineMessage({
          id:
            'judicial.system.restriction_cases:overview.case_resent_modal.input.label',
          defaultMessage: 'Hverju var breytt?',
          description:
            'Notaður sem titill í "Hverju var breytt?" textasvæði í modal sem kemur þegar krafa er endursend',
        }),
        placeholder: {
          id:
            'judicial.system.restriction_cases:overview.case_resent_modal.input.placeholder',
          defaultMessage: 'Skrá hverju var breytt í kröfunni',
          description:
            'Notaður sem skýritexti í "Hverju var breytt?" textasvæði í modal sem kemur þegar krafa er endursend',
        },
      },
    },
  },
}
