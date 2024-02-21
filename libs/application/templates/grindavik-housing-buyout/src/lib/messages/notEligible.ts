import { defineMessages } from 'react-intl'

export const notEligible = defineMessages({
  sectionTitle: {
    id: 'ghb.application:notEligible.section.title',
    defaultMessage: 'Not eligible title',
    description: 'Not eligible section title',
  },
  description: {
    id: 'ghb.application:notEligible.description#markdown',
    defaultMessage:
      'Samkvæmt upplýsingum um lögheimili frá **Þjóðskrá** er þitt sveitarfélag **{locality}**.\n\nÞessi umsókn er aðeins fyrir einstaklinga með lögheimili í Grindavík.',
    description: 'Not eligible description',
  },
})
