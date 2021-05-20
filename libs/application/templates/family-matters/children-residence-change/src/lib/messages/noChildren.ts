import { defineMessages } from 'react-intl'

// No children modal text
export const noChildren = defineMessages({
  title: {
    id: 'crc.application:section.backgroundInformation.noChildren.title',
    defaultMessage: 'Engin börn í þinni forsjá',
    description: 'Title displayed in modal when there are no children found',
  },
  description: {
    id:
      'crc.application:section.backgroundInformation.noChildren.description#markdown',
    defaultMessage:
      'Samkvæmt gögnum úr Þjóðskrá Ísland eru engin börn skráð í þinni forsjá. Þessi umsókn er aðeins fyrir foreldra með sameiginlega forsjá. Við bendum á að hægt er að senda beiðni um breytt lögheimili barna til Sýslumanna.',
    description:
      'Description displayed in modal when there are no children found',
  },
  buttonLabel: {
    id: 'crc.application:section.backgroundInformation.noChildren.buttonLabel',
    defaultMessage: 'Beiðni um breytta forsjá.',
    description:
      'Button label displayed in modal when there are no children found',
  },
})
