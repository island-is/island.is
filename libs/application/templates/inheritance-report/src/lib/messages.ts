import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Application begin
  institutionName: {
    id: 'ir.application:institution.name',
    defaultMessage: 'Sýslumenn',
    description: 'Institution name',
  },
  draftTitle: {
    id: 'ir.application:draft.title',
    defaultMessage: 'Drög',
    description: 'Draft title',
  },
  draftDescription: {
    id: 'ir.application:draft.description',
    defaultMessage: 'Drög að ólokinni umsókn',
    description: 'Draft description',
  },
  institution: {
    id: 'ir.application:institution',
    defaultMessage: 'Sýslumenn',
    description: '',
  },
  confirmButton: {
    id: 'ir.application:confirmButton',
    defaultMessage: 'Staðfesta',
    description: '',
  },

  // Data collection - external data providers
  dataCollectionTitle: {
    id: 'ir.application:dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'ir.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: '',
  },
  dataCollectionCheckbox: {
    id: 'ir.application:dataCollectionCheckbox',
    defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
    description: '',
  },
  dataCollectionNoEstatesError: {
    id: 'ir.application:dataCollectionNoEstatesError',
    defaultMessage:
      'Þú ert ekki skráð/ur fyrir dánarbúi hjá sýslumanni. Ef þú telur svo vera skaltu hafa samband við sýslumann.',
    description:
      'User not eligible for estate or no estates found bound to their national id',
  },
  deceasedInfoProviderTitle: {
    id: 'ir.application:deceasedInfoProviderTitle',
    defaultMessage: 'Upplýsingar um hinn látna',
    description: '',
  },
  deceasedInfoProviderSubtitle: {
    id: 'ir.application:deceasedInfoProviderSubtitle',
    defaultMessage:
      'Upplýsingar frá sýslumanni um kennitölu, dánardag, lögheimili, erfingja, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  personalInfoProviderTitle: {
    id: 'ir.application:personalInfoProviderTitle',
    defaultMessage: 'Persónuupplýsingar um þig',
    description: '',
  },
  personalInfoProviderSubtitle: {
    id: 'ir.application:personalInfoProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  settingsInfoProviderTitle: {
    id: 'ir.application:settingsInfoProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  settingsInfoProviderSubtitle: {
    id: 'ir.application:settingsInfoProviderSubtitle',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },
  financialInformationProviderTitle: {
    id: 'ir.application:financialInformationProviderTitle',
    defaultMessage: 'Fjárhagsupplýsingar úr skattaskýrslu hins látna',
    description: '',
  },
  financialInformationProviderSubtitle: {
    id: 'ir.application:financialInformationProviderSubtitle',
    defaultMessage: 'vantar hér',
    description: '',
  },

  // Applicant's Information
  applicantsInfo: {
    id: 'ir.application:applicantsInfo',
    defaultMessage: 'Samskiptaupplýsingar',
    description: '',
  },
  applicantsInfoSubtitle: {
    id: 'ir.application:applicantsInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },
  name: {
    id: 'ir.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  nationalId: {
    id: 'ir.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  address: {
    id: 'ir.application:address',
    defaultMessage: 'Lögheimili',
    description: '',
  },
  phone: {
    id: 'ir.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'ir.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },

  // Inheritance report submit
  irSubmitTitle: {
    id: 'ir.application:irSubmitTitle',
    defaultMessage: 'Skil á erfðafjárskýrslu',
    description: '',
  },
  irSubmitSubtitle: {
    id: 'ir.application:irSubmitSubtitle',
    defaultMessage:
      'Við uppgjör dánarbús þurfa erfingjarnir að fylla út erfðafjárskýrslu og skila til sýslumanns. Þú hefur valið að skila inn erfðafjárskýrslu fyrir:',
    description: '',
  },

  // The deceased
  theDeceased: {
    id: 'ir.application:theDeceased',
    defaultMessage: 'Hinn látni',
    description: '',
  },
  nameOfTheDeceased: {
    id: 'ir.application:nameOfTheDeceased',
    defaultMessage: 'Nafn hins látna',
    description: '',
  },
  deathDate: {
    id: 'ir.application:deathDate',
    defaultMessage: 'Dánardagur',
    description: '',
  },
  deathDateNotRegistered: {
    id: 'ir.application:deathDateNotRegistered',
    defaultMessage: 'Dánardagur ekki skráður',
    description: '',
  },
})
