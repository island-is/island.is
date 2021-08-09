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
        'Hér má finna lista yfir þau framboð og þá listabókstafi sem þú getur eða hefur mælt með. Hægt er að mæla með einum eða fleiri listabókstöfum en eingöngu einu framboði.',
      description: 'Endorsement intro text',
    },
    myEndorsements: {
      id: 'sp.endorsements:my-endorsements',
      defaultMessage: 'Mínar skráningar',
      description: 'Section title for your endorsements',
    },
    availablePartyApplicationEndorsements: {
      id: 'sp.endorsements:available-endorsements',
      defaultMessage: 'Framboðslistar sem þú getur stutt í þínu kjördæmi',
      description: 'Section title for available endorsements in your area',
    },
    availablePartyLetterEndorsements: {
      id: 'sp.endorsements:available-party-letter-endorsements',
      defaultMessage: 'Listabókstafir sem þú getur mælt með',
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
