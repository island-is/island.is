import { defineMessage } from 'react-intl'

export const defendant = {
  heading: defineMessage({
    id: 'judicial.system.investigation_cases:defendant.heading',
    defaultMessage: 'Rannsóknarheimild',
    description:
      'Notaður sem titill á sakbornings skrefi í rannsóknarheimildum.',
  }),
  sections: {
    defendantInfo: {
      addDefendantButtonText: defineMessage({
        id: 'judicial.system.investigation_cases:defendant.defendant_info.add_defendant_button_text',
        defaultMessage: 'Bæta við varnaraðila',
        description:
          'Notaður sem text í "bæta við varnaraðila" takkann á varnaraðila skrefi í rannsóknarheimildum.',
      }),
    },
  },
}
