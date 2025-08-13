import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ss.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'ss.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'ss.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
      description: 'The following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ss.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'I understand',
    },
    submitButton: {
      id: 'ss.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'External data submit button',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'ss.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'ss.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'ss.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'ss.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  educationalCareer: defineMessages({
    title: {
      id: 'ss.application:externalData.educationalCareer.title',
      defaultMessage:
        'Upplýsingar um námsferil frá mínum síðum Ísland.is og námsumsjónarkerfum skólanna',
      description: 'Information about your educational career',
    },
    subTitle: {
      id: 'ss.application:externalData.educationalCareer.subTitle',
      defaultMessage:
        'Upplýsingar um lokaeinkunnir úr grunnskóla eða fyrirliggjandi námsgráður og skírteini verða sóttar við úrvinnslu umsókna.',
      description: 'We will fetch degrees and certificates',
    },
  }),
}
