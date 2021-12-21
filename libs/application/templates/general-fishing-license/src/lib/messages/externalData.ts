import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'an.application:section.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id: 'an.application:section.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'an.application:section.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt.',
      description: 'External information retrieval subtitle',
    },
    checkboxLabel: {
      id: 'an.application:section.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'External information retrieval checkbox label',
    },
  }),
  directoryOfFisheries: defineMessages({
    title: {
      id: 'an.application:section.externalData.directoryOfFisheries.title',
      defaultMessage: 'Upplýsingar frá Fiskistofu',
      description: 'Approval of directory of labor',
    },
    description: {
      id:
        'an.application:section.externalData.directoryOfFisheries.description',
      defaultMessage:
        'Nafn fiskveiðiskips, skipaskrárnúmer, lengd, brúttótonn.',
      description:
        'Approval of gathering information from directory of fisheries',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'an.application:section.externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'Title: National Registry',
    },
    description: {
      id: 'an.application:section.externalData.nationalRegistry.description',
      defaultMessage: 'Upplýsingar um nafn, kennitölu og heimilisfang.',
      description: 'Description: National Registry',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'an.application:section.externalData.userProfile.title',
      defaultMessage: 'Upplýsingar úr prófilgrunni á island.is',
      description: 'Title: External Info from user profile provider',
    },
    description: {
      id: 'an.application:section.externalData.userProfile.description',
      defaultMessage:
        'Símanúmer, netfang. Upplýsingar um símanúmer eða netfang er hægt að uppfæra á vefsíðu island.is ef þess þarf.',
      description: 'Description: External Info from user profile provider',
    },
  }),
  extraInformation: defineMessages({
    description: {
      id:
        'an.application:section.externalData.extraInformation.descriptionFirstPart',
      defaultMessage:
        'Texti frá Fiskistofu... er nauðsynlegt að fá upplýsingar um skipið til þess að hægt sé að ganga frá Veiðileyfi. Upplýsinganna er aflað á grundvelli heimildar í 5. tölul. 9. gr. laga nr. 90/2018, um persónuvernd og vinnslu persónuupplýsinga. ',
      description: 'Description for link in extrainformation',
    },
  }),
}
