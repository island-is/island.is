import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'hwp.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    confirmationStepTitle: {
      id: 'hwp.application:externalData.dataProvider.confirmationStepTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation step title',
    },
    pageTitle: {
      id: 'hwp.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'hwp.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External data sub title',
    },
    checkboxLabel: {
      id: 'hwp.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'External data checkbox label',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'hwp.application:externalData.nationalRegistry.title',
      defaultMessage: 'Persónupplýsingar úr Þjóðskrá',
      description: 'National Registry title',
    },
    subTitle: {
      id: 'hwp.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'National Registry sub title',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'hwp.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'User profile title',
    },
    subTitle: {
      id: 'hwp.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description: 'User profile sub title',
    },
  }),
  healtcareLicenses: defineMessages({
    title: {
      id: 'hwp.application:externalData.healtcaseLicenses.title',
      defaultMessage: 'Starfsleyfi hjá Embætti Landlæknis',
      description: 'Healthcare licenses title',
    },
    subTitle: {
      id: 'hwp.application:externalData.healtcaseLicenses.subTitle',
      defaultMessage:
        'Upplýsingar úr starfsleyfaskrá um þín starfsleyfi hjá Embætti Landlæknis.',
      description: 'Healthcare licenses sub title',
    },
  }),
  universityOfIceland: defineMessages({
    title: {
      id: 'hwp.application:externalData.universityOfIceland.title',
      defaultMessage: 'Námsferill hjá Háskóla Íslands',
      description: 'Academic career title',
    },
    subTitle: {
      id: 'hwp.application:externalData.universityOfIceland.subTitle',
      defaultMessage:
        'Upplýsingar um brautskráningar frá Háskóla Íslands verða sóttar',
      description: 'Healthcare licenses sub title',
    },
  }),
}
