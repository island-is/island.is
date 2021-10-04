import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  legalOwners: {
    id: 'sp.assets:legal-owners',
    defaultMessage: 'Þinglýstir eigendur',
  },
  ssn: {
    id: 'sp.assets:ssn', // FIXME: This should come from global
    defaultMessage: 'Kennitala',
  },
  authorization: {
    id: 'sp.assets:authorization',
    defaultMessage: 'Heimild',
  },
  holdings: {
    id: 'sp.assets:holdings',
    defaultMessage: 'Eignarhlutfall',
  },
  status: {
    id: 'sp.assets:status',
    defaultMessage: 'Staða',
  },
  location: {
    id: 'sp.assets:location',
    defaultMessage: 'Staðfang',
  },
  locationNumber: {
    id: 'sp.assets:location-number',
    defaultMessage: 'Staðfanganúmer',
  },
  housing: {
    id: 'sp.assets:housing',
    defaultMessage: 'Íbúðarhúsnæði',
  },
  appraisal: {
    id: 'sp.assets:appraisal',
    defaultMessage: 'Fasteignamat',
  },
  description: {
    id: 'sp.assets:description',
    defaultMessage: 'Lýsing',
  },
  unitsOfUse: {
    id: 'sp.assets:units-of-use',
    defaultMessage: 'Notkunareiningar',
  },
  marking: {
    id: 'sp.assets:marking',
    defaultMessage: 'Merking',
  },
  municipality: {
    id: 'sp.assets:municipality',
    defaultMessage: 'Sveitarfélag',
  },
  purchaseDate: {
    id: 'sp.assets:purchase-date',
    defaultMessage: 'Dagsetning eignarheimildar',
  },
  siteAssessment: {
    id: 'sp.assets:site-assessment',
    defaultMessage: 'Lóðarmat',
  },
  usage: {
    id: 'sp.assets:usage',
    defaultMessage: 'Notkun',
  },
  fireAssessment: {
    id: 'sp.assets:fire-assessment',
    defaultMessage: 'Brunabótamat',
  },
  fireCompAssessment: {
    id: 'sp.assets:fire-comp-assessment',
    defaultMessage: 'Brunabótamat',
  },
  operation: {
    id: 'sp.assets:operation',
    defaultMessage: 'Starfsemi',
  },
  disclaimerA: {
    id: 'sp.assets:disclaimer-a',
    defaultMessage: `22. gr. laga nr. 6/2001 um skráningu og mat fasteigna segir að skráður
    eigandi fasteignar sé sá sem hefur þinglýsta eignarheimild hverju sinni
    og skal eigendaskráning Þjóðskrár Íslands þar af leiðandi byggja á
    þinglýstum heimildum. Það athugist því ef misræmi er á eigendaskráningu
    í fasteignaskrá annars vegar og þinglýsingabók hins vegar gildir
    skráning þinglýsingabókar.`,
  },
  disclaimerB: {
    id: 'sp.assets:disclaimer-b',
    defaultMessage: `Þjóðskrá Íslands hefur umsjón með fasteignaskrá. Í skránni er að finna
    grunnupplýsingar um lönd og lóðir auk mannvirkja sem á þeim standa. Þar
    er meðal annars að finna upplýsingar um fasteigna- og brunabótamat,
    stærðir, byggingarár, byggingarefni, notkun og auðkennisnúmer eigna.`,
  },
})
