import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'gfl.application:conclusion.general.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Title of conclusion screen',
    },
  }),
  information: defineMessages({
    title: {
      id: 'gfl.application:conclusion.information.title',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Title of conclusion information box',
    },
    intro: {
      id: 'gfl.application:conclusion.information.intro#markdown',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion information box intro',
    },
    bulletList: {
      id: 'gfl.application:conclusion.information.bulletList#markdown',
      defaultMessage: `* Veiðileyfi tekur gildi næsta virka dag eftir að það hefur verið greitt, óhað greiðslukorti / kröfu.\n* Hægt er að nálgast leyfið í rafrænum skjölum á island.is`,
      description: 'BulletList for conclusion information box',
    },
  }),
}
