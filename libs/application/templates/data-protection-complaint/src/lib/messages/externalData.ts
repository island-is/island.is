import { defineMessage, defineMessages } from 'react-intl'

export const externalData = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'externalData page title',
    },
    subTitle: {
      id: 'dpac.application:section.externalData.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt.',
      description: 'externalData page sub title',
    },
    checkboxLabel: {
      id: 'dpac.application:section.externalData.checkboxLabel',
      defaultMessage:
        'Ég skil að persónuuplýsinga verður aflað vegna kvörtunar til Persónuverndar',
      description: 'externalData page checkbox label',
    },
    description: {
      id: 'dpac.application:section.externalData.pageDescription',
      defaultMessage: `Persónuvernd er nauðsynlegt að fá réttar tengiliðaupplýsingar
      um þig til þess að hægt sé að taka kvörtun þína til meðferðar og úrlausnar.
      Upplýsinganna er aflað á grundvelli heimildar í 5. tölul. 9. gr. laga nr.
      90/2018, um persónuvernd og vinnslu persónuupplýsinga.`,
      description: 'externalData page description',
    },
  }),
  labels: defineMessage({
    nationalRegistryTitle: {
      id: 'dpac.application:section.externalData.labels.nationRegistryTitle',
      defaultMessage: 'Grunnupplýsingar frá Þjóðskrá Íslands',
      description: 'National Registry Title',
    },
    nationalRegistrySubTitle: {
      id: 'dpac.application:section.externalData.labels.nationalRegistrySubTitle',
      defaultMessage: 'Nafn, kennitala og lögheimili.',
      description: 'National Registry Subtitle',
    },
    userProfileTitle: {
      id: 'dpac.application:section.externalData.labels.userProfileTitle',
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'User Profile Title',
    },
    userProfileSubTitle: {
      id: 'dpac.application:section.externalData.labels.userProfileSubTitle',
      defaultMessage:
        'Símanúmer, netfang. Upplýsingar um símanúmer eða netfang er hægt að uppfæra á vefsíðu island.is ef þess þarf.',
      description: 'User Profile Subtitle',
    },
  }),
}
