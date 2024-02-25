import { defineMessages } from 'react-intl'

export const notEligible = defineMessages({
  sectionTitle: {
    id: 'ghb.application:notEligible.section.title',
    defaultMessage: 'Lögheimili ekki í Grindavík 10. nóvember 2023',
    description: 'Not eligible section title',
  },
  description: {
    id: 'ghb.application:notEligible.description#markdown',
    defaultMessage:
      'Samkvæmt upplýsingum um lögheimili frá **Þjóðskrá** varst þú með skráð lögeimili í **{locality}** þann 10. nóvember 2023.\n\nÞessi umsókn er aðeins fyrir einstaklinga með lögheimili í Grindavík þann 10. nóvember 2023.',
    description: 'Not eligible description',
  },
})
