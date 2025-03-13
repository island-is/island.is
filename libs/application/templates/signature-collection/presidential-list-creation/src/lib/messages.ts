import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationName: {
    id: 'slc.application:applicationName',
    defaultMessage: 'Stofna meðmælasöfnun',
    description: '',
  },
  institution: {
    id: 'slc.application:institution',
    defaultMessage: 'Þjóðskrá',
    description: '',
  },
  /* Intro */
  intro: {
    id: 'slc.application:intro',
    defaultMessage: 'Um söfnunina',
    description: '',
  },
  introTitle: {
    id: 'slc.application:introTitle',
    defaultMessage: 'Forsetakostningar 2024',
    description: '',
  },
  introDescription: {
    id: 'slc.application:introDescription#markdown',
    defaultMessage:
      'Aðeins frambjóðandi getur stofnað meðmælasöfnun. Kannað er hvort hann megi fara í framboð, það er sé orðinn 35 ára á kjördag og íslenskur ríkisborgari.',
    description: '',
  },

  /* Gagnaöflun */
  dataCollection: {
    id: 'slc.application:dataCollection',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'slc.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: '',
  },
  dataCollectionCheckbox: {
    id: 'slc.application:dataCollectionCheckbox',
    defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
    description: '',
  },
  dataCollectionSubmit: {
    id: 'slc.application:dataCollectionSubmit',
    defaultMessage: 'Staðfesta',
    description: '',
  },
  nationalRegistryProviderTitle: {
    id: 'slc.application:nationalRegistryProviderTitle',
    defaultMessage: 'Persónuupplýsingar um þig',
    description: '',
  },
  nationalRegistryProviderSubtitle: {
    id: 'slc.application:nationalRegistryProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  userProfileProviderTitle: {
    id: 'slc.application:userProfileProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  userProfileProviderSubtitle: {
    id: 'slc.application:userProfileProviderSubtitle',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },

  /* Upplýsingar um meðmælalista */
  listInformationSection: {
    id: 'slc.application:listInformationSection',
    defaultMessage: 'Upplýsingar um meðmælalista',
    description: '',
  },
  listInformationDescription: {
    id: 'slc.application:listInformationDescription#markdown',
    defaultMessage:
      'Upplýsingar um frambjóðanda og meðmælalista sem verða stofnaðir.',
    description: '',
  },
  information: {
    id: 'slc.application:information',
    defaultMessage: 'Upplýsingar',
    description: '',
  },
  applicantHeader: {
    id: 'slc.application:applicantHeader',
    defaultMessage: 'Frambjóðandi',
    description: '',
  },
  name: {
    id: 'slc.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  nationalId: {
    id: 'slc.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  phone: {
    id: 'slc.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'slc.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },
  collectionHeader: {
    id: 'slc.application:collectionHeader',
    defaultMessage: 'Söfnun meðmæla',
    description: '',
  },
  collectionDateFrom: {
    id: 'slc.application:collectionDateFrom',
    defaultMessage: 'Upphafsdagsetning',
    description: '',
  },
  collectionDateTil: {
    id: 'slc.application:collectionDateTil',
    defaultMessage: 'Lokadagsetning',
    description: '',
  },

  /* Overview */
  overview: {
    id: 'slc.application:overview',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  overviewDescription: {
    id: 'slc.application:overviewDescription#markdown',
    defaultMessage:
      'Stofnaðir verða fjórir meðmælalistar, einn fyrir hvern landsfjórðung. Safna þarf meðmælum kjósenda í hverjum landsfjórðungi.',
    description: '',
  },
  applicantOverviewHeader: {
    id: 'slc.application:applicantOverviewHeader',
    defaultMessage: 'Upplýsingar um frambjóðanda',
    description: '',
  },
  listOverviewHeader: {
    id: 'slc.application:listOverviewHeader',
    defaultMessage: 'Meðmælalistar sem verða stofnaðir',
    description: '',
  },
  listDateTil: {
    id: 'slc.application:listDateTil',
    defaultMessage: 'Lokadagur',
    description: '',
  },
  createList: {
    id: 'slc.application:createList',
    defaultMessage: 'Stofna meðmælasöfnun',
    description: '',
  },

  /* Done Screen */
  listCreated: {
    id: 'slc.application:listCreated',
    defaultMessage: 'Meðmælalisti stofnaður',
    description: '',
  },
  listCreatedDescription: {
    id: 'slc.application:listCreatedDescription',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat lacus at nisl dignissim, ut scelerisque eros rhoncus. Donec maximus gravida sapien, sit amet hendrerit diam dignissim ut.',
    description: '',
  },
  nextStepsDescription: {
    id: 'slc.application:nextStepsDescription#markdown',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat lacus at nisl dignissim, ut scelerisque eros rhoncus. Donec maximus gravida sapien, sit amet hendrerit diam dignissim ut.',
    description: '',
  },
  linkFieldButtonTitle: {
    id: 'slc.application:linkFieldButtonTitle',
    defaultMessage: 'Mínar síður',
    description: '',
  },
  linkFieldMessage: {
    id: 'slc.application:linkFieldMessage',
    defaultMessage:
      'Á mínum síðum sést hve mörgum meðmælum hefur verið safnað í hverjum landsfjórðungi.',
    description: '',
  },

  /* Action Card History logs */
  logListCreated: {
    id: 'slc.application:listCreated',
    defaultMessage: 'Meðmælalisti stofnaður',
    description: '',
  },
})
