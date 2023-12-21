import { defineMessages } from 'react-intl'

export const complete = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:complete.general.formTitle',
      defaultMessage: 'Mál hefur verið sent inn til yfirferðar',
      description: 'Title of the complete screen',
    },
  }),
  bullets: defineMessages({
    first: {
      id: 'ojoi.application:complete.bullets.first',
      defaultMessage:
        'Starfsfólk mun fara yfir auglýsinguna og þú færð staðfestingu þegar auglýsingin þín fer í birtingu',
      description: 'First bullet of the complete screen',
    },
    second: {
      id: 'ojoi.application:complete.bullets.second',
      defaultMessage:
        'Ef auglýsingin þarfnast einhverra breytinga færð þú tilkynningu um það.',
      description: 'Second bullet of the complete screen',
    },
  }),
}
