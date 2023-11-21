import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'hlc.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'hlc.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'hlc.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External data sub title',
    },
    checkboxLabel: {
      id: 'hlc.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'External data checkbox label',
    },
    // submitButton: {
    //   id: 'hlc.application:externalData.dataProvider.submitButton',
    //   defaultMessage: 'Hefja umsókn',
    //   description: 'External data submit button',
    // },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'hlc.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'National Registry title',
    },
    subTitle: {
      id: 'hlc.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina.',
      description: 'National Registry sub title',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'hlc.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'User profile title',
    },
    subTitle: {
      id: 'hlc.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description: 'User profile sub title',
    },
  }),
  healtcareLicenses: defineMessages({
    title: {
      id: 'hlc.application:externalData.healtcaseLicenses.title',
      defaultMessage: 'Starfsleyfi hjá Embætti Landlæknis',
      description: 'Healthcare licenses title',
    },
    subTitle: {
      id: 'hlc.application:externalData.healtcaseLicenses.subTitle',
      defaultMessage:
        'Upplýsingar úr starfsleyfaskrá um þín starfsleyfi hjá Embætti Landlæknis.',
      description: 'Healthcare licenses sub title',
    },
  }),
}
