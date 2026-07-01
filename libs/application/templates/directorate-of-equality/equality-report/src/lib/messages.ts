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
    userProfileTitle: {
      id: 'equalityReport.application:dataProviders.userProfileTitle',
      description: 'Title of the user profile data provider',
      defaultMessage: 'Staða í þjóðfélaginu',
    },
    companyDataTitle: {
      id: 'equalityReport.application:dataProviders.companyDataTitle',
      description: 'Title of the company registry data provider',
      defaultMessage: 'Upplýsingar úr fyrirtækjaskrá',
    },
    companyDataSubTitle: {
      id: 'equalityReport.application:dataProviders.companyDataSubTitle',
      description: 'Subtitle of the company registry data provider',
      defaultMessage: 'Grunnupplýsingar um fyrirtæki eru sóttar úr fyrirtækjaskrá RSK.',
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
  }),
}
