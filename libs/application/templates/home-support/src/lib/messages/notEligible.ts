import { defineMessages } from 'react-intl'

export const notEligible = defineMessages({
  sectionTitle: {
    id: 'hst.application:notEligible.section.title',
    defaultMessage: 'Heimastuðningur hjá þínu sveitarfélagi',
    description: 'Not eligible section title',
  },
  description: {
    id: 'hst.application:notEligible.description#markdown',
    defaultMessage:
      'Samkvæmt upplýsingum um lögheimili frá **Þjóðskrá** er þitt sveitarfélag **{locality}**.\n\nÞitt sveitarfélag er ekki komið inn í þetta umsóknarferli. Kynntu þér málið eða sæktu um fjárhagsaðstoð á heimasíðu þíns sveitarfélags eða þess sveitarfélags sem sér um Heimastuðning hjá þínu sveitarfélagi.',
    description: 'Not eligible description',
  },
})
