import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'gfl.application:conclusion.general.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Title of conclusion screen',
    },
    sectionTitle: {
      id: 'gfl.application:conclusion.general.sectionTitle',
      defaultMessage: 'Umsókn móttekin',
      description: 'Title of conclusion screen',
    },
  }),
  information: defineMessages({
    bulletOne: {
      id: 'gfl.application:conclusion.information.bulletOne',
      defaultMessage:
        'Veiðileyfi tekur gildi næsta virka dag eftir að það hefur verið greitt, óhað greiðslukorti / kröfu.',
      description: 'Conclusion information box bulletOne',
    },
    bulletTwo: {
      id: 'gfl.application:conclusion.information.bulletTwo',
      defaultMessage:
        'Hægt er að nálgast leyfið í rafrænum skjölum á island.is',
      description: 'Conclusion information box bulletTwo',
    },
    electronicDocumentsText: {
      id: 'gfl.application:conclusion.information.electronicDocumentsText',
      defaultMessage: 'Rafræn skjöl',
      description: 'Conclusion information box electronic documets text',
    },
    electronicDocumentsLink: {
      id: 'gfl.application:conclusion.information.electronicDocumentsLink',
      defaultMessage: 'https://island.is/minarsidur/postholf',
      description: 'Conclusion information box electronic documets link',
    },
  }),
}
