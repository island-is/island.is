import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Applicant
  phone: {
    id: 'gpl.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'gpl.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },

  // Application Name
  applicationName: {
    id: 'gpl.application:applicationName',
    defaultMessage: 'Undirskriftalisti',
    description: '',
  },

  // Inngangur
  introTitle: {
    id: 'gpl.application:introTitle',
    defaultMessage: 'Inngangur',
    description: '',
  },
  introDescription: {
    id: 'gpl.application:introDescription#markdown',
    defaultMessage: 'Vantar texta hér',
    description: '',
  },
  introSubmit: {
    id: 'gpl.application:introSubmit',
    defaultMessage: 'Halda áfram',
    description: '',
  },

  // Terms
  externalDataSectionTitle: {
    id: 'gpl.application:externalDataSectionTitle',
    defaultMessage: 'Skilmálar',
    description: '',
  },
  externalDataSectionSubtitle: {
    id: 'gpl.application:externalDataSectionSubtitle',
    defaultMessage: 'Eftirfarandi gildir um söfnun undirskrifta',
    description: '',
  },
  externalDataSectionTermsAndConditions: {
    id: 'gpl.application:externalDataSectionTermsAndConditions',
    defaultMessage:
      'Vakin er athygli á lögum um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018. Ábyrgðaraðili staðfestir hér með að listinn sé í samræmi við lög og reglur landsins og stjórnarskrá Íslands. Vinnsluaðila er heimilt að loka lista niður fari hann gegn ofangreindu.',
    description: '',
  },
  externalDataSectionCheckbox: {
    id: 'gpl.application:externalDataSectionCheckbox',
    defaultMessage: 'Ég samþykki skilmála hér að ofan',
    description: '',
  },

  // Petition List Information
  listInformationTitle: {
    id: 'gpl.application:listTitle',
    defaultMessage: 'Upplýsingar um lista',
    description: '',
  },
  listInformationSideTitle: {
    id: 'gpl.application:listInformationSideTitle',
    defaultMessage: 'Upplýsingar',
    description: '',
  },
  listName: {
    id: 'gpl.application:listName',
    defaultMessage: 'Heiti lista',
    description: '',
  },
  listNamePlaceholder: {
    id: 'gpl.application:listNamePlaceholder',
    defaultMessage: 'Veldu nafn á lista',
    description: '',
  },
  aboutList: {
    id: 'gpl.application:aboutList',
    defaultMessage: 'Um lista',
    description: '',
  },
  aboutListPlaceholder: {
    id: 'gpl.application:aboutListPlaceholder',
    defaultMessage:
      'Texti sem birtist með undirskriftalista. Ekki er hægt að breyta texta eftir að undirskriftalisti hefur verið birtur.',
    description: '',
  },
  dateTitle: {
    id: 'gpl.application:dateTitle',
    defaultMessage: 'Tímabil lista',
    description: '',
  },
  dateFromPlaceholder: {
    id: 'gpl.application:dateFromPlaceholder',
    defaultMessage: 'Frá',
    description: '',
  },
  dateToPlaceholder: {
    id: 'gpl.application:dateToPlaceholder',
    defaultMessage: 'Til',
    description: '',
  },

  // Overview
  overviewTitle: {
    id: 'gpl.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  overviewSubtitle: {
    id: 'gpl.application:overviewSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar hér að neðan og staðfestu að þær séu réttar. Eftir að listi er stofnaður ekki er hægt að breyta upplýsingum um lista.',
    description: '',
  },
  overviewApplicant: {
    id: 'gpl.application:overviewApplicant',
    defaultMessage: 'Stofnandi lista',
    description: '',
  },
  listPeriod: {
    id: 'gpl.application:listPeriod',
    defaultMessage: 'Tímabil lista',
    description: '',
  },
  submitButton: {
    id: 'gpl.application:submit',
    defaultMessage: 'Stofna lista',
    description: '',
  },

  // Done
  listCreatedTitle: {
    id: 'gpl.application:listCreatedTitle',
    defaultMessage: 'Undirskriftalista hefur verið skilað til Ísland.is',
    description: '',
  },
  listCreatedSubtitle: {
    id: 'gpl.application:listCreatedSubtitle#markdown',
    defaultMessage:
      'Hægt er að sjá stöðu lista, undirskriftir og breyta gildistíma lista inná Mínum Síðum.',
    description: '',
  },
  linkToList: {
    id: 'gpl.application:linkToList',
    defaultMessage: 'Hlekkur á lista',
    description: '',
  },
  copyLinkButton: {
    id: 'gpl.application:copyLinkButton',
    defaultMessage: 'Afrita hlekk',
    description: '',
  },

  // Sign Petition
  toastError: {
    id: 'gpl.application:toastError',
    defaultMessage:
      'Ekki tókst að setja nafn þitt á lista. Vinsamlegast reyndu aftur síðar',
    description: '',
  },
  listOpenTil: {
    id: 'gpl.application:listOpenTil',
    defaultMessage: 'Undirskriftalistinn er opinn til',
    description: '',
  },
  listOwner: {
    id: 'gpl.application:listOwner',
    defaultMessage: 'Ábyrgðarmaður',
    description: '',
  },
  name: {
    id: 'gpl.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  hideNameLabel: {
    id: 'gpl.application:hideNameLabel',
    defaultMessage: 'Ekki birta nafn mitt á lista',
    description: '',
  },
  hideNameText: {
    id: 'gpl.application:hideNameText',
    defaultMessage:
      '* Athugið að nafn þitt er sýnilegt ábyrgðamanni listans en birtist ekki á vef eða hjá öðrum sem hafa skráð sig á lista.',
    description: '',
  },
  agreeToTermsLabel: {
    id: 'gpl.application:agreeToTermsLabel',
    defaultMessage:
      'Ég hef kynnt mér ofangreint málefni og samþykki uppflettingu í Þjóðskrá',
    description: '',
  },
  listClosedMessage: {
    id: 'gpl.application:listClosedMessage',
    defaultMessage: 'Undirskriftalista hefur verið lokað',
    description: '',
  },
  signPetition: {
    id: 'gpl.application:signPetition',
    defaultMessage: 'Setja nafn mitt á lista',
    description: '',
  },
  petitionSigned: {
    id: 'gpl.application:petitionSigned',
    defaultMessage: 'Þú hefur sett nafn þitt á listann',
    description: '',
  },
  backtoSP: {
    id: 'gpl.application:backtoSP',
    defaultMessage: 'Mínar Síður',
    description: '',
  },

  // Validation
  validationApproveTerms: {
    id: 'gpl.application:validationApproveTerms',
    defaultMessage: 'Vinsamlegast samþykktu skilmála',
    description: '',
  },
  validationListName: {
    id: 'gpl.application:validationListName',
    defaultMessage: 'Vinsamlegast veldu nafn á listann',
    description: '',
  },
  validationAboutList: {
    id: 'gpl.application:validationAboutList',
    defaultMessage: 'Vinsamlegast veldu lýsingu á listann',
    description: '',
  },
  validationSelectDate: {
    id: 'gpl.application:validationSelectDate',
    defaultMessage: 'Vinsamlegast veldu dagsetningu',
    description: '',
  },
  validationTilBeforeFrom: {
    id: 'gpl.application:validationTilBeforeFrom',
    defaultMessage: 'Lokadagsetning má ekki vera á undan upphafsdagsetningu',
    description: '',
  },

  // History logs
  logListInProgress: {
    id: 'gpl.application:listInProgress',
    defaultMessage: 'Gerð lista hafin',
    description: '',
  },
  logListCreated: {
    id: 'gpl.application:listCreated',
    defaultMessage: 'Listi stofnaður',
    description: '',
  },
})
