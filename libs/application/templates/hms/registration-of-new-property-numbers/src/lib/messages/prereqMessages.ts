import { defineMessages } from 'react-intl'

export const prereqMessages = defineMessages({
  tabTitle: {
    id: 'ronp.application:prereq.tabTitle',
    defaultMessage: 'Forkröfur',
    description: 'Prerequisites tab title',
  },
  prereqTitle: {
    id: 'ronp.application:prereq.prereqTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Prerequisites title',
  },
  userProfileTitle: {
    id: 'ronp.application:prereq.userProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is',
    description: 'User profile title',
  },
  userProfileSubtitle: {
    id: 'ronp.application:prereq.userProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráðar upplýsingar um síma og netfang inni á Mínar síður á Ísland.is þá verða þær sjálfkrafa settar inn í umsóknina',
    description: 'User profile subtitle',
  },
  nationalRegistryTitle: {
    id: 'ronp.application:prereq.nationalRegistryTitle',
    defaultMessage: 'Þjóðskrá Íslands.',
    description: 'National registry title',
  },
  nationalRegistrySubtitle: {
    id: 'ronp.application:prereq.nationalRegistrySubtitle',
    defaultMessage:
      'Við sækjum upplýsingar um nafn, kennitölu og heimilisfang úr Þjóðskrá.',
    description: 'National registry subtitle',
  },
  propertiesTitle: {
    id: 'ronp.application:prereq.propertiesTitle',
    defaultMessage: 'Húsnæðis og mannvirkjastofnun',
    description: 'Properties title',
  },
  propertiesSubtitle: {
    id: 'ronp.application:prereq.propertiesSubtitle',
    defaultMessage:
      'Í ferlinu sækjum við upplýsingar um fasteignir í þinni eigu.',
    description: 'Properties subtitle',
  },
  checkboxLabel: {
    id: 'ronp.application:prereq.checkboxLabel',
    defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
    description: 'External information retrieval checkbox label',
  },
  subTitle: {
    id: 'ronp.application:prereq.subTitle',
    defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt.',
    description: 'External information retrieval subtitle',
  },

  getPropertiesErrorTitle: {
    id: 'ronp.application:prereq.getPropertiesErrorTitle',
    defaultMessage: 'Ekki tókst að sækja upplýsingar um fasteignir',
    description: 'Error title for getting properties',
  },
  getPropertiesErrorSummary: {
    id: 'ronp.application:prereq.getPropertiesErrorSummary#markdown',
    defaultMessage:
      'Vinsamlega hafið samband við HMS í [hms@hms.is](mailto:hms@hms.is)',
    description: 'Error summary for getting properties',
  },
})
