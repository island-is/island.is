import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Data collection - external data providers
  dataCollectionTitle: {
    id: 'es.application:dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'es.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: '',
  },
  deceasedInfoProviderTitle: {
    id: 'es.application:deceasedInfoProviderTitle',
    defaultMessage: 'UUpplýsingar um hinn látna',
    description: '',
  },
  deceasedInfoProviderSubtitle: {
    id: 'es.application:deceasedInfoProviderSubtitle',
    defaultMessage:
      'Upplýsingar frá sýslumanni um fæðingar- og dánardag, lögheimili, erfðir, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  personalInfoProviderTitle: {
    id: 'es.application:personalInfoProviderTitle',
    defaultMessage: 'Persónuupplýsingar um þig',
    description: '',
  },
  personalInfoProviderSubtitle: {
    id: 'es.application:personalInfoProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  settingsInfoProviderTitle: {
    id: 'es.application:settingsInfoProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  settingsInfoProviderSubtitle: {
    id: 'es.application:settingsInfoProviderSubtitle',
    defaultMessage: 'Persónustillingar þínar frá Ísland.is.',
    description: '',
  },

  // Applicant
  announcer: {
    id: 'es.application:announcer',
    defaultMessage: 'Tilkynnandi',
    description: '',
  },
  applicantsInfoSubtitle: {
    id: 'es.application:applicantsInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },
  name: {
    id: 'es.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  nationalId: {
    id: 'es.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  address: {
    id: 'es.application:address',
    defaultMessage: 'Lögheimili',
    description: '',
  },
  phone: {
    id: 'es.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'es.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },

  // Estate members
  estateMembersTitle: {
    id: 'es.application:estateMembersTitle',
    defaultMessage: 'Erfingjar og erfðaskrá',
    description: '',
  },
  estateMembersSubtitle: {
    id: 'es.application:estateMembersSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },

  // Validation errors
  errorPhoneNumber: {
    id: 'es.application:error.errorPhoneNumber',
    defaultMessage: 'Símanúmer virðist ekki vera rétt',
    description: 'Phone number is invalid',
  },
  errorEmail: {
    id: 'es.application:error.errorEmail',
    defaultMessage: 'Netfang virðist ekki vera rétt',
    description: 'Email is invalid',
  },
  errorRelation: {
    id: 'es.application:error.errorRelation',
    defaultMessage: 'Tengsl virðast ekki vera rétt',
    description: 'Relation is invalid',
  },

  // Assets
  errorNumberEmpty: {
    id: 'es.application:error.errorNumberEmpty',
    defaultMessage: 'Númer má ekki vera tómt',
    description: 'Invalid general asset number error message',
  },
})
