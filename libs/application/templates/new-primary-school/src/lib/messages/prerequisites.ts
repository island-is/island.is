import { defineMessages } from 'react-intl'

export const prerequisitesMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'nps.application:prerequisites.shared.sectionTitle',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
  }),
  externalData: defineMessages({
    subSectionTitle: {
      id: 'nps.application:prerequisites.externalData.subSectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    description: {
      id: 'nps.application:prerequisites.externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    nationalRegistryInformationTitle: {
      id: 'nps.application:prerequisites.externalData.nationalRegistryInformationTitle',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    nationalRegistryInformationSubTitle: {
      id: 'nps.application:prerequisites.externalData.nationalRegistryInformationSubTitle',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'Information about you, spouse and children.',
    },
    userProfileInformationTitle: {
      id: 'nps.application:prerequisites.externalData.userProfileInformationTitle',
      defaultMessage: 'Upplýsingar af mínum síðum á Ísland.is',
      description: 'Information from My Pages at Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'nps.application:prerequisites.externalData.userProfileInformationSubTitle',
      defaultMessage:
        'Upplýsingar um netfang og símanúmer eru sóttar á mínar síður á Ísland.is.',
      description:
        'Information about email address and phone number will be retrieved from My Pages at Ísland.is.',
    },
    childInformationTitle: {
      id: 'nps.application:prerequisites.externalData.childInformationTitle',
      defaultMessage: 'Upplýsingar frá Miðstöð menntunar og skólaþjónustu',
      description:
        'Information from the Directorate of Education and School Services',
    },
    childInformationSubTitle: {
      id: 'nps.application:prerequisites.externalData.childInformationSubTitle',
      defaultMessage: 'Upplýsingar um barn og ólíkar þarfir þess.',
      description: 'Information about the child and their different needs.',
    },
    checkboxProvider: {
      id: 'nps.application:prerequisites.externalData.checkboxProvider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
  }),
  children: defineMessages({
    subSectionTitle: {
      id: 'nps.application:prerequisites.children.subSectionTitle',
      defaultMessage: 'Börn',
      description: 'Children',
    },
    description: {
      id: 'nps.application:prerequisites.children.description#markdown',
      defaultMessage: `Samkvæmt uppflettingu í Þjóðskrá hefur þú forsjá með eftirfarandi barni/börnum. Ef þú sérð ekki barnið þitt hér, þá bendum við þér að hafa samband við Þjóðskrá. \n\nAthugaðu að einungis er hægt að sækja um fyrir eitt barn í einu. Ef skrá á tvö börn svo sem tvíbura er hægt að fara beint í að skrá annað barn þegar búið er að skrá það fyrra.`,
      description: `According to Registers Iceland, you have custody of the following child/children. If you do not see your child here, please contact Registers Iceland. \n\nPlease note that you can only apply for one child at a time. If you want to register two children, such as twins, you can proceed to register the second child directly after completing the registration for the first one.`,
    },
    radioTitle: {
      id: 'nps.application:prerequisites.children.radioTitle',
      defaultMessage: 'Veldu barn fyrir umsóknina',
      description: 'Select child for the application',
    },
    startApplication: {
      id: 'nps.application:prerequisites.children.startApplication',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),
}
