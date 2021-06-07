import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  endorsement: defineMessages({
    introTitle: {
      id: 'sp.endorsements:title',
      defaultMessage: 'Meðmælendalistar',
      description: 'Endorsement page title',
    },
    intro: {
      id: 'sp.endorsements:intro',
      defaultMessage:
        'Einhver texti um hvaða umboð aðili hefur og hvaða aðgerðir eru í boði',
      description: 'Endorsement intro text',
    },
    myEndorsements: {
      id: 'sp.endorsements:my-endorsements',
      defaultMessage: 'Mínar skráningar',
      description: 'Section title for your endorsements',
    },
    availableEndorsements: {
      id: 'sp.endorsements:available-endorsements',
      defaultMessage: 'Meðmælendalistar sem þú getur stutt í þínu kjördæmi',
      description: 'Section title for available endorsements in your area',
    },
    actionCardButtonEndorse: {
      id: 'sp.endorsements:endorse-button',
      defaultMessage: 'Mæla með',
      description: 'Button to navigate to the application system',
    },
    actionCardButtonUnendorse: {
      id: 'sp.endorsements:un-endorse-button',
      defaultMessage: 'Afskrá meðmæli',
      description: 'Button to navigate to the application system',
    },
  }),
}
