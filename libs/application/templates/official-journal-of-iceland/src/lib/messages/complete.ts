import { defineMessages } from 'react-intl'

export const complete = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:complete.general.title',
      defaultMessage: 'Mál hefur verið sent inn til yfirferðar',
      description: 'Title of the complete screen',
    },
    bullets: {
      id: 'ojoi.application:complete.bullets',
      defaultMessage:
        `* Starfsfólk mun fara yfir auglýsinguna og þú færð staðfestingu þegar auglýsingin þín fer í birtingu\n` +
        `* Ef auglýsingin þarfnast einhverra breytinga færð þú tilkynningu um það.`,
      description: 'Bullets of the complete screen',
    },
  }),
}
