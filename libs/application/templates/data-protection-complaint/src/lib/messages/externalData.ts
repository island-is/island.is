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
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
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
      defaultMessage: `Persónuvernd er nauðsynlegt að fá staðfestar upplýsingar um þig til þess að þú getir lagt fram eftirfarandi kvörtun. Eftirfarandi gagna verður því aflað með vísan til 2. tl. 9. gr. laga um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018.`,
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
      id:
        'dpac.application:section.externalData.labels.nationalRegistrySubTitle',
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
      defaultMessage: 'Símanúmer, netfang',
      description: 'User Profile Subtitle',
    },
    printButtonLabel: {
      id: 'dpac.application:section.overview.labels.userProfileSubTitle',
      defaultMessage: 'Hlaða kvörtuninni niður í PDF-skjali',
      description: 'The label of the print button on the overview screen',
    },
  }),
}
