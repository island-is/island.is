import { defineMessages } from 'react-intl'

export const messages = {
  general: defineMessages({
    applicationName: {
      id: 'equalityReport.application:general.applicationName',
      defaultMessage: 'Jafnréttisáætlun',
    },
    institution: {
      id: 'equalityReport.application:general.institution',
      defaultMessage: 'Dómsmálaráðuneytið',
    },
  }),
  notAllowed: defineMessages({
    title: {
      id: 'equalityReport.application:notAllowed.title',
      defaultMessage: 'Þú hefur ekki aðgang að þessari umsókn',
    },
    description: {
      id: 'equalityReport.application:notAllowed.description',
      defaultMessage: 'Vinsamlegast skráðu þig inn í umboði fyrirtækis til að skila inn jafnréttisáætlun.',
    },
  }),
  dataProviders: defineMessages({
    checkboxLabel: {
      id: 'equalityReport.application:dataProviders.checkboxLabel',
      description: 'Label for the checkbox to approve fetching data from external data providers',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
    },
    companyDataTitle: {
      id: 'equalityReport.application:dataProviders.companyDataTitle',
      description: 'Title of the company registry data provider',
      defaultMessage: 'Upplýsingar úr fyrirtækjaskrá',
    },
    companyDataIntro: {
      id: 'equalityReport.application:dataProviders.companyDataIntro',
      description: 'Intro of the company registry data provider',
      defaultMessage: 'Nafn fyrirtækis, kennitala, heimilisfang og fleiri upplýsingar.',
    },
    userProfileTitle: {
      id: 'equalityReport.application:dataProviders.userProfileTitle',
      description: 'Title of the user profile data provider',
      defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
    },
    userProfileIntro: {
      id: 'equalityReport.application:dataProviders.userProfileIntro',
      description: 'Intro of the user profile data provider',
      defaultMessage: 'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    },
    nationalRegistryTitle: {
      id: 'equalityReport.application:dataProviders.nationalRegistryTitle',
      description: 'Title of the national registry data provider',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
    },
    nationalRegistryIntro: {
      id: 'equalityReport.application:dataProviders.nationalRegistryIntro',
      description: 'Intro of the national registry data provider',
      defaultMessage: 'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    },
  }),
  prerequisites: defineMessages({
    sectionTitle: {
      id: 'equalityReport.application:prerequisites.sectionTitle',
      description: 'Title of the prerequisites section',
      defaultMessage: 'Forsendur',
    },
    formTitle: {
      id: 'equalityReport.application:prerequisites.formTitle',
      description: 'Title of the prerequisites form',
      defaultMessage: 'Gagnaöflun',
    },
    formIntro: {
      id: 'equalityReport.application:prerequisites.formIntro',
      description: 'Description of the prerequisites form',
      defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    },
    approveExternalData: {
      id: 'equalityReport.application:prerequisites.approveExternalData',
      description: 'Error message of the data providers in prerequisites form',
      defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
    }
  }),
}
