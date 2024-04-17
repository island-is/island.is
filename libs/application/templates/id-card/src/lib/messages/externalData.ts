import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'id.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'id.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'id.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External data sub title',
    },
    description: {
      id: 'id.application:externalData.dataProvider.description',
      defaultMessage: `Lorem ipsum`,
      description: 'External data description',
    },
    checkboxLabel: {
      id: 'id.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'External data checkbox label',
    },
    submitButton: {
      id: 'id.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'External data submit button',
    },
  }),
  preInformation: defineMessages({
    sectionTitle: {
      id: 'id.application:externalData.preInformation.sectionTitle',
      defaultMessage: 'Nafnskírteinisumókn',
      description: 'Pre information about application section title ',
    },
    title: {
      id: 'id.application:externalData.preInformation.title',
      defaultMessage: 'Nafnskírteini',
      description: 'Pre information about application title',
    },
    description: {
      id: 'id.application:externalData.preInformation.description#markdown',
      defaultMessage:
        'Í þessari umsókn getur þú sótt um nafnskírteini fyrir þig eða einstaklinga í þinni forsjá. Eftir þetta ferli þarf að mæta í myndatöku hjá næsta sýslumanni til þess að skírteinið geti farið í framleiðslu. Þegar nafnskírteinið er tilbúið þá getur þú sótt það hjá því sýslumannsembætti sem hentar þér best.',
      description: 'Pre information about application description',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'id.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'National Registry title',
    },
    subTitle: {
      id: 'id.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Lorem ipsum',
      description: 'National Registry sub title',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'id.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'User profile title',
    },
    subTitle: {
      id: 'id.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description: 'User profile sub title',
    },
  }),
  // districtCommissioner: defineMessages({
  //   title: {
  //     id: 'id.application:externalData.districtCommissioner.title',
  //     defaultMessage: 'Persónuupplýsingar úr Sýslumenn',
  //     description: 'Some description',
  //   },
  //   subTitle: {
  //     id: 'id.application:externalData.districtCommissioner.subTitle',
  //     defaultMessage:
  //       'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Sýslumenn til þess að fylla út umsóknina.',
  //     description: 'Some description',
  //   },
  // }), // TODO WILL THIS NOT BE USED?
  identityDocument: defineMessages({
    title: {
      id: 'id.application:externalData.identityDocument.title',
      defaultMessage: 'Skilríkjaskrá',
      description: 'Identity document provider title',
    },
    subTitle: {
      id: 'id.application:externalData.identityDocument.subTitle',
      defaultMessage:
        'Uppfletting í skilríkjaskrá hjá Þjóðskrá um einstaklinga úr þinni forsjá.',
      description: 'Identity document provider subtitle',
    },
  }),
}
