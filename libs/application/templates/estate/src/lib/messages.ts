import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Application begin
  institutionName: {
    id: 'es.application:institution.name',
    defaultMessage: 'Sýslumenn',
    description: 'Institution name',
  },
  draftTitle: {
    id: 'es.application:draft.title',
    defaultMessage: 'Drög',
    description: 'Draft title',
  },
  draftDescription: {
    id: 'es.application:draft.description',
    defaultMessage: 'Drög að ólokinni umsókn',
    description: 'Draft description',
  },
  // Application end

  // Prereqs title
  prerequisitesTitle: {
    id: 'es.application:prerequisitesTitle',
    defaultMessage: 'Ákvörðun um skipti bús',
    description: '',
  },
  prerequisitesSubtitle: {
    id: 'es.application:prerequisitesSubtitle',
    defaultMessage:
      'Hægt er að fara fjórar leiðir við skipti á búi. Vinsamlega veldu þá leið sem þú og aðrir erfingjar viljið fara.',
    description: '',
  },
  institution: {
    id: 'es.application:institution',
    defaultMessage: 'Sýslumenn',
    description: '',
  },
  confirmButton: {
    id: 'es.application:confirmButton',
    defaultMessage: 'Staðfesta',
    description: '',
  },

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
    defaultMessage: 'Upplýsingar um hinn látna',
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

  // The deceased
  theDeceased: {
    id: 'es.application:theDeceased',
    defaultMessage: 'Hinn látni',
    description: '',
  },
  deathDate: {
    id: 'es.application:deathDate',
    defaultMessage: 'Dánardagur',
    description: '',
  },
  deathDateNotRegistered: {
    id: 'es.application:deathDateNotRegistered',
    defaultMessage: 'Dánardagur ekki skráður',
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

  // Estate members, assets, vehicles
  estateMembersTitle: {
    id: 'es.application:estateMembersTitle',
    defaultMessage: 'Erfingjar of erfðaskrá',
    description: '',
  },
  estateMembersSubtitle: {
    id: 'es.application:estateMembersSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },
  estateMembers: {
    id: 'es.application:estateMembers',
    defaultMessage: 'Erfingjar',
    description: '',
  },
  willsAndAgreements: {
    id: 'es.application:willsAndAgreements',
    defaultMessage: 'Erfðaskrá og kaupmáli',
    description: '',
  },
  willsInCustody: {
    id: 'es.application:willsInCustody',
    defaultMessage: 'Erfðaskrá í vörslu sýslumanns',
    description: '',
  },
  agreements: {
    id: 'es.application:agreements',
    defaultMessage: 'Kaupmáli',
    description: '',
  },
  otherWills: {
    id: 'es.application:otherWills',
    defaultMessage: 'Vitneskja um aðra erfðaskrá',
    description: '',
  },
  properties: {
    id: 'es.application:properties',
    defaultMessage: 'Eignir',
    description: '',
  },
  propertiesDescription: {
    id: 'es.application:propertiesDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },
  realEstateAndLand: {
    id: 'es.application:realEstateAndLand',
    defaultMessage: 'Fasteignir og lóðir',
    description: '',
  },
  realEstateAndLandDescription: {
    id: 'es.application:realEstateAndLandDescription',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir',
    description: '',
  },
  vehicles: {
    id: 'es.application:vehicles',
    defaultMessage: 'Farartæki',
    description: '',
  },
  vehiclesDescription: {
    id: 'es.application:vehiclesDescription',
    defaultMessage: 'Til dæmis bifreiðar, flugvélar og bátar',
    description: '',
  },
  acceptDebtsLabel: {
    id: 'es.application:acceptDebtsLabel',
    defaultMessage:
      'Ég samþykki að taka yfir áhvílandi skuldir á þessu farartæki sem vitneskja er um',
    description: '',
  },

  // Overview
  overviewTitle: {
    id: 'es.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  overviewSubtitleWithNoProperty: {
    id: 'es.application:overviewSubtitle',
    defaultMessage:
      'Þú hefur valið að tilkynna um eignarlaust bú. Vinsamlega lesið yfir neðangreindar upplýsingar, uppfærið og staðfestið eftir því sem við á.',
    description: '',
  },
  overviewSubtitleOfficialEstate: {
    id: 'es.application:overviewSubtitleOfficialEstate',
    defaultMessage:
      'Þú hefur valið að tilkynna um opinber skipti. Vinsamlega lesið yfir neðangreindar upplýsingar, uppfærið og staðfestið eftir því sem við á.',
    description: '',
  },

  // Done
  doneTitle: {
    id: 'es.application:officialExchangeDoneTitle',
    defaultMessage: 'Tilkynning móttekin',
    description: '',
  },
  officialExchangeDoneSubtitle: {
    id: 'es.application:officialExchangeDoneSubtitle#markdown',
    defaultMessage: 'Sýslumaður hefur móttekið beiðni þína um opinber skipti.',
    description: '',
  },
  estateWithNoPropertySubtitle: {
    id: 'es.application:estateWithNoPropertySubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið yfirlýsingu þína um eignarlaust dánarbú. Hún verður nú yfirfarin og staðfesting á eignarleysi í kjölfar sent í pósthólf þitt á Ísland.is',
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
