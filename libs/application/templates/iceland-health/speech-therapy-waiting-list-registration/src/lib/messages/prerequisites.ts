import { defineMessages } from 'react-intl'

export const prerequisitesMessages = {
  externalData: defineMessages({
    sectionTitle: {
      id: 'stwlr.application:prerequisites.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    description: {
      id: 'stwlr.application:prerequisites.externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    nationalRegistryInformationTitle: {
      id: 'stwlr.application:prerequisites.externalData.nationalRegistryInformationTitle',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    nationalRegistryInformationSubTitle: {
      id: 'stwlr.application:prerequisites.externalData.nationalRegistryInformationSubTitle',
      defaultMessage:
        'Nafn, kennitala og lögheimili þitt og barnsins, ásamt staðfestingu á forsjá.',
      description:
        'Name, national ID number, and domicile of you and your child, along with custody confirmation.',
    },
    userProfileInformationTitle: {
      id: 'stwlr.application:prerequisites.externalData.userProfileInformationTitle',
      defaultMessage: 'Upplýsingar af mínum síðum á Ísland.is',
      description: 'Information from My Pages at Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'stwlr.application:prerequisites.externalData.userProfileInformationSubTitle',
      defaultMessage:
        'Upplýsingar um netfang og símanúmer eru sóttar á mínar síður á Ísland.is.',
      description:
        'Information about email address and phone number will be retrieved from My Pages at Ísland.is.',
    },
    icelandHealthInformationTitle: {
      id: 'stwlr.application:prerequisites.externalData.icelandHealthInformationTitle',
      defaultMessage: 'Upplýsingar frá Sjúkratryggingum',
      description: 'Information from the Icelandic Health',
    },
    icelandHealthInformationSubTitle: {
      id: 'stwlr.application:prerequisites.externalData.icelandHealthInformationSubTitle',
      defaultMessage:
        'Staða skráningar barnsins á miðlægum biðlista talmeinaþjónustu.',
      description:
        "Information about the child's registration status on the central speech therapy waiting list will be retrieved from the Icelandic Health Insurance.",
    },
    checkboxProvider: {
      id: 'stwlr.application:prerequisites.externalData.checkboxProvider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
  }),
  children: defineMessages({
    sectionTitle: {
      id: 'stwlr.application:prerequisites.children.sectionTitle',
      defaultMessage: 'Börn',
      description: 'Children',
    },
    description: {
      id: 'stwlr.application:prerequisites.children.description#markdown',
      defaultMessage: '<Texti>',
      description: 'Description for the children subsection',
    },
    radioTitle: {
      id: 'stwlr.application:prerequisites.children.radioTitle',
      defaultMessage: 'Veldu barn fyrir umsóknina',
      description: 'Select child for the application',
    },
    startApplication: {
      id: 'stwlr.application:prerequisites.children.startApplication',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),
}
