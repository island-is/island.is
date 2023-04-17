import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'doi.rpr.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Endurnýja dvalarleyfi',
      description: `Application's name`,
    },
    subTitle: {
      id: 'doi.rpr.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    description: {
      id: 'doi.rpr.application:externalData.dataProvider.description',
      defaultMessage:
        'Integer id augue in erat ultrices pharetra a vel neque. Integer pellentesque, erat vel varius imperdiet, nisl turpis imperdiet augue, at vulputate lorem mauris in nibh. ',
      description: `External data description`,
    },
    checkboxLabel: {
      id: 'doi.rpr.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'I understand',
    },
    submitButton: {
      id: 'doi.rpr.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'doi.rpr.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry',
    },
    subTitle: {
      id: 'doi.rpr.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'doi.rpr.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'doi.rpr.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
}
