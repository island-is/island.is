import { defineMessages } from 'react-intl'

export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id: 'mc.application:externalData.general.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'mc.application:externalData.general.pageTitle',
      defaultMessage: 'Umsókn um veðbókarvottorð',
      description: 'External data page title',
    },
    subTitle: {
      id: 'mc.application:externalData.general.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'External data sub title',
    },
    checkboxLabel: {
      id: 'mc.application:externalData.general.checkboxLabel',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað við úrvinnslu umsóknarinnar',
      description: 'External data checkbox label',
    },
  }),
  labels: defineMessages({
    nationalRegistryTitle: {
      id: 'mc.application:externalData.labels.nationalRegistryTitle',
      defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
      description: 'Personal information from the National Registry',
    },
    nationalRegistrySubTitle: {
      id: 'mc.application:externalData.labels.nationalRegistrySubTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description:
        'Information from the National Registry will be used to prefill the data in the application',
    },
    userProfileInformationTitle: {
      id: 'mc.application:externalData.labels.userProfileInformationTitle',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    userProfileInformationSubTitle: {
      id: 'mc.application:externalData.labels.userProfileInformationSubTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
}
