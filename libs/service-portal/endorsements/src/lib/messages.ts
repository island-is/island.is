import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  endorsement: defineMessages({
    introTitle: {
      id: 'sp.service.portal:endorsements-title',
      defaultMessage: 'Meðmælendalistar',
      description: 'Endorsement page title',
    },
    intro: {
      id: 'sp.service.portal:endorsements-intro',
      defaultMessage:
        'Einhver texti um hvaða umboð aðili hefur og hvaða aðgerðir eru í boði',
      description: 'Endorsement intro text',
    },
    myEndorsements: {
      id: 'sp.service.portal:endorsements-my-endorsements',
      defaultMessage: 'Mínar skráningar',
      description: 'Section title for your endorsements',
    },
    availableEndorsements: {
      id: 'sp.service.portal:endorsements-available-endorsements',
      defaultMessage: 'Meðmælendalistar sem þú getur stutt í þínu kjördæmi',
      description: 'Section title for available endorsements in your area',
    },
    actionCardButton: {
      id: 'sp.service.portal:endorsements-button',
      defaultMessage: 'Skoða nánar',
      description: 'Button to navigate to the application system',
    },
  }),
}
