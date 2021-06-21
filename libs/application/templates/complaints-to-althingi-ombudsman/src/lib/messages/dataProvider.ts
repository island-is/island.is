import { defineMessages } from 'react-intl'

export const dataProvider = defineMessages({
  header: {
    id: 'ctao.application:dataProvider.header',
    defaultMessage: 'Gagnaöflun',
    description: 'Name of the header in data provider',
  },
  nationalRegistryTitle: {
    id: 'ctao.application:dataProvider.nationalRegistryTitle',
    defaultMessage: 'Grunnupplýsingar frá Þjóðskrá Íslands',
    description: 'National Registry Title',
  },
  nationalRegistrySubTitle: {
    id: 'ctao.application:dataProvider.nationalRegistrySubTitle',
    defaultMessage: 'Nafn, kennitala og lögheimili.',
    description: 'National Registry Subtitle',
  },
  userProfileTitle: {
    id: 'ctao.application:dataProvider.userProfileTitle',
    defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
    description: 'User Profile Title',
  },
  userProfileSubTitle: {
    id: 'ctao.application:dataProvider.userProfileSubTitle',
    defaultMessage:
      'Símanúmer, netfang. Upplýsingar um símanúmer eða netfang er hægt að uppfæra á vefsíðu island.is ef þess þarf.',
    description: 'User Profile Subtitle',
  },
})
