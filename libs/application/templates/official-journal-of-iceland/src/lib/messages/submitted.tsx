import { defineMessages } from 'react-intl'

export const submitted = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:submitted.general.title',
      defaultMessage: 'Mál hefur verið sent inn til yfirferðar',
      description: 'Title of the submitted screen',
    },
    returnToServicePortal: {
      id: 'ojoi.application:submitted.general.returnToServicePortal',
      defaultMessage: 'Fara til baka á mínar síður',
      description: 'Return to service portal button text',
    },
    newApplication: {
      id: 'ojoi.application:submitted.general.newApplication',
      defaultMessage: 'Ný umsókn',
      description: 'New application button text',
    },
    section: {
      id: 'ojoi.application:submitted.general.section',
      defaultMessage: 'Staðfesting',
      description: 'Section title of the submitted screen',
    },
  }),
  bullets: defineMessages({
    first: {
      id: 'ojoi.application:submitted.bullets.first',
      defaultMessage:
        'Starfsfólk mun fara yfir auglýsinguna og þú færð staðfestingu þegar auglýsingin þín fer í birtingu',
      description: 'First bullet of the submitted screen',
    },
    second: {
      id: 'ojoi.application:submitted.bullets.second',
      defaultMessage:
        'Ef auglýsingin þarfnast einhverra breytinga færð þú tilkynningu um það.',
      description: 'Second bullet of the submitted screen',
    },
  }),
}
