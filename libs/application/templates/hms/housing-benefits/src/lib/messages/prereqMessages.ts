import { defineMessages } from 'react-intl'

export const prereqMessages = defineMessages({
  confirmReadSectionTitle: {
    id: 'hb.application:prereq.confirmReadSectionTitle',
    defaultMessage: 'Lestur',
    description: 'Confirm read section title',
  },
  confirmReadTitle: {
    id: 'hb.application:prereq.confirmReadTitle',
    defaultMessage: 'Staðfesting á lestri upplýsinga',
    description: 'Confirm read multi field title',
  },
  confirmRead: {
    id: 'hb.application:prereq.confirmRead#markdown',
    defaultMessage:
      'Vinsamlegast kynntu þér [Persónuverndarstefnu HMS](https://island.is/s/hms/hms-personuverndarstefna) og efni á Ísland.is um [húsnæðisbætur](https://island.is/umsokn-um-husnaedisbaetur) áður en lengra er haldið.',
    description: 'Confirm read section title',
  },
  confirmReadPrivacyPolicy: {
    id: 'hb.application:prereq.confirmReadPrivacyPolicy',
    defaultMessage: 'Ég hef kynnt mér Persónuverndarstefnu HMS',
    description: 'Confirm read section confirm read privacy policy',
  },
  confirmMunicipalityTitle: {
    id: 'hb.application:prereq.confirmMunicipalityTitle',
    defaultMessage: 'Sérstakur húsnæðisstuðningur',
    description: 'Confirm municipality section title',
  },
  confirmMunicipalityDescription: {
    id: 'hb.application:prereq.confirmMunicipalityDescription',
    defaultMessage:
      'Sveitarfélagið þitt þarf samþykki til að fletta upp upplýsingum um þig til að ákvarða sérstakan húsnæðisstuðning.',
    description: 'Confirm municipality section description',
  },
  confirmMunicipalityCheckbox: {
    id: 'hb.application:prereq.confirmMunicipalityCheckbox',
    defaultMessage:
      'Ég leyfi sveitarfélaginu mínu að sækja upplýsingar um mig.',
    description: 'Confirm municipality section checkbox',
  },
  confirmReadHousingBenefitsInfo: {
    id: 'hb.application:prereq.confirmReadHousingBenefitsInfo',
    defaultMessage: 'Ég hef kynnt mér efni Ísland.is um húsnæðisbætur',
    description: 'Confirm read section confirm read housing benefits info',
  },
  municipalitiesDataProviderTitle: {
    id: 'hb.application:prereq.municipalitiesDataProviderTitle',
    defaultMessage: 'Sveitarfélög',
    description: 'Municipalities data provider title',
  },
  municipalitiesDataProviderSubtitle: {
    id: 'hb.application:prereq.municipalitiesDataProviderSubtitle',
    defaultMessage:
      'Heimila mínusveitarfélagi til að sækja mínar upplýsingar fyrir ákvörðun um sérstakan húsnæðisstuðning',
    description: 'Municipalities data provider subtitle',
  },
  userProfileTitle: {
    id: 'hb.application:prereq.userProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is',
    description: 'User profile title',
  },
  userProfileSubtitle: {
    id: 'hb.application:prereq.userProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráðar upplýsingar um síma og netfang inni á Mínar síður á Ísland.is þá verða þær sjálfkrafa settar inn í umsóknina',
    description: 'User profile subtitle',
  },
  nationalRegistryTitle: {
    id: 'hb.application:prereq.nationalRegistryTitle',
    defaultMessage: 'Þjóðskrá Íslands.',
    description: 'National registry title',
  },
  nationalRegistrySubtitle: {
    id: 'hb.application:prereq.nationalRegistrySubtitle',
    defaultMessage: 'Upplýsingar um nafn, kennitölu og heimilisfang',
    description: 'National registry subtitle',
  },
  hmsTitle: {
    id: 'hb.application:prereq.hmsTitle',
    defaultMessage: 'Húsnæðis, mannvirkja og skipulagsstofnun',
    description: 'HMS title',
  },
  hmsSubtitle: {
    id: 'hb.application:prereq.hmsSubtitle',
    defaultMessage: 'Upplýsingar um leigusamninga sem þú ert aðili að',
    description: 'HMS subtitle',
  },
  taxTitle: {
    id: 'hb.application:prereq.taxTitle',
    defaultMessage: 'Skatturinn',
    description: 'Tax title',
  },
  taxSubtitle: {
    id: 'hb.application:prereq.taxSubtitle',
    defaultMessage: 'Upplýsingar um skattframtöl og staðgreiðslu',
    description: 'Tax subtitle',
  },
  checkboxLabel: {
    id: 'fca.application:prereq.checkboxLabel',
    defaultMessage:
      'Ég skil að ofangreindra upplýsinga verður aflað við úrvinnslu tilkynningarinnar',
    description: 'External information retrieval checkbox label',
  },
  subTitle: {
    id: 'fca.application:prereq.subTitle',
    defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt.',
    description: 'External information retrieval subtitle',
  },
  externalDataTitle: {
    id: 'fca.application:prereq.externalDataTitle',
    defaultMessage: 'Gagnaöflun fyrir umsókn um húsnæðisbætur',
    description: 'External data title',
  },
  devMockSectionTitle: {
    id: 'hb.application:prereq.devMockSectionTitle',
    defaultMessage: 'Prófun (gervigögn)',
    description: 'Dev-only mock data section title',
  },
  devMockUseMockTitle: {
    id: 'hb.application:prereq.devMockUseMockTitle',
    defaultMessage: 'Viltu geta notað gervigögn?',
    description: 'Whether to enable mock options for development',
  },
  devMockRentalLabel: {
    id: 'hb.application:prereq.devMockRentalLabel',
    defaultMessage: 'Sýna gervileigusamninga',
    description: 'Checkbox: mock rental agreements',
  },
  devMockTaxLabel: {
    id: 'hb.application:prereq.devMockTaxLabel',
    defaultMessage: 'Sýna gervistaðgreiðslugögn',
    description: 'Checkbox: mock tax/direct payments',
  },
  devMockTaxVariantTitle: {
    id: 'hb.application:prereq.devMockTaxVariantTitle',
    defaultMessage: 'Hvernig eiga skattgögn að líta út?',
    description: 'Radio title for tax mock variant',
  },
  devMockTaxVariantSample: {
    id: 'hb.application:prereq.devMockTaxVariantSample',
    defaultMessage: 'Framtali síðasta árs skilað',
    description: 'Tax mock: return sample rows',
  },
  devMockTaxVariantEmpty: {
    id: 'hb.application:prereq.devMockTaxVariantEmpty',
    defaultMessage: 'Framtali ekki skilað',
    description: 'Tax mock: success with empty list',
  },
  devMockTaxVariantRequired: {
    id: 'hb.application:prereq.devMockTaxVariantRequired',
    defaultMessage: 'Veldu hvernig skattgögn eiga að líta út.',
    description: 'Validation when tax mock is on but variant missing',
  },
  devMockNationalRegistryAddressLabel: {
    id: 'hb.application:prereq.devMockNationalRegistryAddressLabel',
    defaultMessage: 'Nota gervigögn fyrir lögheimili úr Þjóðskrá',
    description: 'Checkbox: mock national registry address',
  },
})
