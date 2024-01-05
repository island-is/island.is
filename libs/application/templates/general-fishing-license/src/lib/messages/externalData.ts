import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'gfl.application:section.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id: 'gfl.application:section.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'gfl.application:section.dataProvider.subTitle',
      defaultMessage:
        'Unnið verður með persónugreinanleg gögn frá eftirfarandi aðilum við vinnslu umsóknarinnar',
      description: 'External information retrieval subtitle',
    },
    checkboxLabel: {
      id: 'gfl.application:section.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'External information retrieval checkbox label',
    },
    getDataSuccess: {
      id: 'gfl.application:section.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id: 'gfl.application:section.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'gfl.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  directoryOfFisheries: defineMessages({
    title: {
      id: 'gfl.application:section.externalData.directoryOfFisheries.title',
      defaultMessage: 'Samgöngustofa',
      description: 'Approval of directory of labor',
    },
    description: {
      id: 'gfl.application:section.externalData.directoryOfFisheries.description',
      defaultMessage: 'Skipaskrá. Upplýsingar um lögskráningu. Haffærni skips.',
      description:
        'Approval of gathering information from directory of fisheries',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'gfl.application:section.externalData.nationalRegistry.title',
      defaultMessage: 'Þjóðskrá Íslands/Fyrirtækjaskrá',
      description: 'Title: National Registry',
    },
    description: {
      id: 'gfl.application:section.externalData.nationalRegistry.description',
      defaultMessage: 'Nafn, kennitala og heimilisfang',
      description: 'Description: National Registry',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'gfl.application:section.externalData.userProfile.title',
      defaultMessage: 'Fjársýsla',
      description: 'Title: External Info from user profile provider',
    },
    description: {
      id: 'gfl.application:section.externalData.userProfile.description',
      defaultMessage:
        'Skuldastaða vegna veiðigjalda og álagninga frá Fiskistofu. Greiðsla fyrir veiðileyfi.',
      description: 'Description: External Info from user profile provider',
    },
  }),
  extraInformation: defineMessages({
    description: {
      id: 'gfl.application:section.externalData.extraInformation.descriptionFirstPart',
      defaultMessage:
        'Fiskistofa þarf að afla eftirfarandi upplýsinga til að afgreiða umsóknir um veiðileyfi. Upplýsinganna er aflað á grundvelli heimildar í 5. tölul. 9. gr. laga nr. 90/2018, um persónuvernd og vinnslu persónuupplýsinga.',
      description: 'Description for link in extrainformation',
    },
  }),
}
