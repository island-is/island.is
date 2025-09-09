import { defineMessages } from 'react-intl'

export const m = defineMessages({
  /* Forsetakosningar */
  pageTitlePresidential: {
    id: 'sp.signatureCollection:title',
    defaultMessage: 'Forsetakosningar',
    description: '',
  },
  pageDescriptionSignee: {
    id: 'sp.signatureCollection:pageDescriptionSignee',
    defaultMessage:
      'Aðeins er hægt að mæla með einu framboði. Hægt er að afturkalla meðmæli þangað til söfnun lokar og mæla með öðrum frambjóðanda ef vill.',
    description: '',
  },
  createListButton: {
    id: 'sp.signatureCollection:createListButton',
    defaultMessage: 'Stofna söfnun',
    description: '',
  },
  collectionTitle: {
    id: 'sp.signatureCollection:collectionTitle',
    defaultMessage: 'Forsetakosningar',
    description: '',
  },
  myListsDescription: {
    id: 'sp.signatureCollection:myListsDescription',
    defaultMessage: 'Yfirlit safnana sem þú hefur stofnað',
    description: '',
  },
  copyLinkButton: {
    id: 'sp.signatureCollection:copyLinkButton',
    defaultMessage: 'Afrita hlekk',
    description: '',
  },
  copyLinkDescription: {
    id: 'sp.signatureCollection:copyLinkDescription',
    defaultMessage: 'Hér getur þú afritað hlekk á þitt framboð til að deila',
    description: '',
  },
  copyLinkSuccess: {
    id: 'sp.signatureCollection:copyLinkSuccess',
    defaultMessage: 'Hlekkur afritaður',
    description: '',
  },
  copyLinkError: {
    id: 'sp.signatureCollection:copyLinkError',
    defaultMessage: 'Ekki tókst að afrita hlekk',
    description: '',
  },
  endTime: {
    id: 'sp.signatureCollection:endTime',
    defaultMessage: 'Lokadagur:',
    description: '',
  },
  viewList: {
    id: 'sp.signatureCollection:viewList',
    defaultMessage: 'Skoða nánar',
    description: '',
  },
  collectionActive: {
    id: 'sp.signatureCollection:collectionActive',
    defaultMessage: 'Söfnun í gangi',
    description: '',
  },
  collectionLocked: {
    id: 'sp.signatureCollection:collectionLocked',
    defaultMessage: 'Lista læst',
    description: '',
  },
  collectionClosed: {
    id: 'sp.signatureCollection:collectionClosed',
    defaultMessage: 'Söfnuninni lokið',
    description: '',
  },
  collectionMaxReached: {
    id: 'sp.signatureCollection:collectionMaxReached',
    defaultMessage: 'Hámarki meðmæla náð',
    description: '',
  },
  paperUploadedSignature: {
    id: 'sp.signatureCollection:paperUploadedSignature',
    defaultMessage: 'Meðmæli lesin inn',
    description: '',
  },
  digitalSignature: {
    id: 'sp.signatureCollection:digitalSignature',
    defaultMessage: 'Skrifað undir: ',
    description: '',
  },
  signatureIsInvalid: {
    id: 'sp.signatureCollection:signatureIsInvalid',
    defaultMessage: 'Ógilt meðmæli',
    description: '',
  },
  listSubmitted: {
    id: 'sp.signatureCollection:listSubmitted',
    defaultMessage: 'Lista skilað',
    description: '',
  },

  /* Signee View */
  noUserFound: {
    id: 'sp.signatureCollection:noUserFound',
    defaultMessage:
      'Þú uppfyllir ekki skilyrði til að taka þátt í meðmælasöfnunum',
    description: '',
  },
  noUserFoundDescription: {
    id: 'sp.signatureCollection:noUserFoundDescription#markdown',
    defaultMessage:
      'Ef þú telur þessar upplýsingar rangar, vinsamlegast hafðu samband við Þjóðskrá Íslands.',
    description: '',
  },
  noCollectionIsActive: {
    id: 'sp.signatureCollection:noCollectionIsActive',
    defaultMessage: 'Engin söfnun í gangi',
    description: '',
  },
  noCollectionIsActiveDescription: {
    id: 'sp.signatureCollection:noCollectionIsActiveDescription#markdown',
    defaultMessage:
      'Ef þú telur þig eiga gögn sem ættu að birtast hér, vinsamlegast hafðu samband við Þjóðskrá Íslands.',
    description: '',
  },
  mySigneeListsHeader: {
    id: 'sp.signatureCollection:mySigneeListsHeader',
    defaultMessage: 'Frambjóðandi sem þú hefur mælt með: ',
    description: '',
  },
  mySigneeListsByAreaHeader: {
    id: 'sp.signatureCollection:mySigneeListsByAreaHeader',
    defaultMessage: 'Frambjóðandur á þínu svæði sem hægt er að mæla með',
    description: '',
  },
  signList: {
    id: 'sp.signatureCollection:signList',
    defaultMessage: 'Mæla með frambjóðanda',
    description: '',
  },
  unSignList: {
    id: 'sp.signatureCollection:unSignList',
    defaultMessage: 'Draga meðmæli til baka',
    description: '',
  },
  unSignModalMessage: {
    id: 'sp.signatureCollection:unSignModalMessage',
    defaultMessage:
      'Þú ert við það að draga meðmælin þín til baka. Ertu viss um að þú viljir halda áfram?',
    description: '',
  },
  unSignModalConfirmButton: {
    id: 'sp.signatureCollection:unSignModalButton',
    defaultMessage: 'Já, draga meðmæli tilbaka',
    description: '',
  },
  unSignSuccess: {
    id: 'sp.signatureCollection:unSignSuccess',
    defaultMessage: 'Tókst að draga meðmæli til baka',
    description: '',
  },
  unSignError: {
    id: 'sp.signatureCollection:unSignError',
    defaultMessage: 'Tókst ekki að draga meðmæli til baka',
    description: '',
  },
  actorNoAccessTitle: {
    id: 'sp.signatureCollection:actorNoAccessTitle',
    defaultMessage: 'Ekki réttindi',
    description: '',
  },
  actorNoAccessDescription: {
    id: 'sp.signatureCollection:actorNoAccessDescription#markdown',
    defaultMessage:
      'Eingöngu kennitölur sem hafa skráðan listabókstaf geta stofnað meðmælendasöfnun. Ef þú átt listabókstaf geturðu stofnað meðmælendasöfnun hér.',
    description: '',
  },

  /* Hætta við söfnun modal */
  cancelCollectionButton: {
    id: 'sp.signatureCollection:cancelCollectionButton',
    defaultMessage: 'Hætta við söfnun meðmæla',
    description: '',
  },
  cancelCollectionModalMessage: {
    id: 'sp.signatureCollection:cancelCollectionModalMessage',
    defaultMessage: 'Þú ert að fara að hætta við söfnun meðmæla. Ertu viss?',
    description: '',
  },
  cancelCollectionModalMessageLastList: {
    id: 'sp.signatureCollection:cancelCollectionModalMessageLastList',
    defaultMessage:
      'Þú ert að fara að hætta við söfnun meðmæla í þessu kjördæmi. Þau meðmæli sem þú hefur nú þegar safnað munu eyðast. Athugaðu að með því að hætta við síðustu söfnun framboðsins verður framboðinu einnig eytt. Ertu viss um að þú viljir hætta við söfnun og eyða framboði?',
    description: '',
  },
  cancelCollectionModalConfirmButton: {
    id: 'sp.signatureCollection:modalConfirmButton',
    defaultMessage: 'Já, hætta við',
    description: '',
  },
  cancelCollectionModalConfirmButtonLastList: {
    id: 'sp.signatureCollection:cancelCollectionModalConfirmButtonLastList',
    defaultMessage: 'Já, hætta við söfnun of eyða framboði',
    description: '',
  },
  cancelCollectionModalCancelButton: {
    id: 'sp.signatureCollection:cancelCollectionModalCancelButton',
    defaultMessage: 'Nei, hætta við',
    description: '',
  },
  cancelCollectionModalToastError: {
    id: 'sp.signatureCollection:modalToastError',
    defaultMessage: 'Ekki tókst að hætta við söfnun meðmæla',
    description: '',
  },
  cancelCollectionModalToastSuccess: {
    id: 'sp.signatureCollection:cancelCollectionModalToastSuccess',
    defaultMessage: 'Tókst að hætta við söfnun meðmæla',
    description: '',
  },

  /* Skoða lista */
  listPeriod: {
    id: 'sp.signatureCollection:listPeriod',
    defaultMessage: 'Tímabil lista:',
    description: '',
  },
  numberOfValidSigns: {
    id: 'sp.signatureCollection:numberOfValidSigns',
    defaultMessage: 'Fjöldi gildra meðmæla:',
    description: '',
  },
  coOwners: {
    id: 'sp.signatureCollection:coOwners',
    defaultMessage: 'Umsjónaraðilar:',
    description: '',
  },
  pdfReport: {
    id: 'sp.signatureCollection:pdfReport',
    defaultMessage: 'Skýrsla',
    description: '',
  },
  pdfReportDescription: {
    id: 'sp.signatureCollection:pdfReportDescription',
    defaultMessage: 'Texti sem útskýrir þessa aðgerð kemur hér.',
    description: '',
  },
  downloadPdf: {
    id: 'sp.signatureCollection:downloadPdf',
    defaultMessage: 'Hlaða niður skýrslu',
    description: '',
  },
  downloadPdfDescription: {
    id: 'sp.signatureCollection:downloadPdfDescription',
    defaultMessage:
      'Lorem ipsum dolor sit amet. Vestibulum tincidunt cursus viverra.',
    description: '',
  },
  copyLink: {
    id: 'sp.signatureCollection:copyLink',
    defaultMessage: 'Afrita tengil',
    description: '',
  },
  signeesHeader: {
    id: 'sp.signatureCollection:signeesHeader',
    defaultMessage: 'Yfirlit meðmæla',
    description: '',
  },
  searchInListPlaceholder: {
    id: 'sp.signatureCollection:searchInListPlaceholder',
    defaultMessage: 'Leitaðu að nafni eða kennitölu',
    description: '',
  },
  noSignees: {
    id: 'sp.signatureCollection:noSignees',
    defaultMessage: 'Engin meðmæli',
    description: '',
  },
  noSigneesFoundBySearch: {
    id: 'sp.signatureCollection:noSigneesFoundBySearch',
    defaultMessage: 'Engin meðmæli fundust þegar leitað var að',
    description: '',
  },
  signeeDate: {
    id: 'sp.signatureCollection:signeeDate',
    defaultMessage: 'Dagsetning',
    description: '',
  },
  signeeName: {
    id: 'sp.signatureCollection:signeeName',
    defaultMessage: 'Nafn',
    description: '',
  },
  signeeNationalId: {
    id: 'sp.signatureCollection:signeeNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  paperSigneesHeader: {
    id: 'sp.signatureCollection:paperSigneesHeader',
    defaultMessage: 'Skrá meðmæli af blaði',
    description: '',
  },
  paperSigneesClearButton: {
    id: 'sp.signatureCollection:paperSigneesClearButton',
    defaultMessage: 'Hreinsa',
    description: '',
  },
  paperNumber: {
    id: 'sp.signatureCollection:paperNumber',
    defaultMessage: 'Blaðsíðunúmer',
    description: '',
  },
  paperSigneeName: {
    id: 'sp.signatureCollection:paperSigneeName',
    defaultMessage: 'Nafn meðmælanda',
    description: '',
  },
  signPaperSigneeButton: {
    id: 'sp.signatureCollection:signPaperSigneeButton',
    defaultMessage: 'Skrá meðmæli á lista',
    description: '',
  },
  paperSigneeTypoTitle: {
    id: 'sp.signatureCollection:paperSigneeTypoTitle',
    defaultMessage: 'Kennitala ekki á réttu formi',
    description: '',
  },
  paperSigneeTypoMessage: {
    id: 'sp.signatureCollection:paperSigneeTypoMessage',
    defaultMessage: 'Vinsamlegast athugið kennitöluna og reynið aftur',
    description: '',
  },
  paperSigneeCantSignTitle: {
    id: 'sp.signatureCollection:paperSigneeCantSignTitle',
    defaultMessage: 'Ekki er hægt að skrá meðmæli',
    description: '',
  },
  paperSigneeCantSignMessage: {
    id: 'sp.signatureCollection:paperSigneeCantSign',
    defaultMessage: 'Kennitala uppfyllir ekki skilyrði fyrir að skrá meðmæli',
    description: '',
  },
  paperSigneeSuccess: {
    id: 'sp.signatureCollection:paperSigneeSuccess',
    defaultMessage: 'Meðmæli skráð',
    description: '',
  },
  paperSigneeError: {
    id: 'sp.signatureCollection:paperSigneeError',
    defaultMessage: 'Ekki tókst að skrá meðmæli',
    description: '',
  },
  editPaperNumber: {
    id: 'sp.signatureCollection:editPaperNumber',
    defaultMessage: 'Breyta blaðsíðunúmeri',
    description: '',
  },
  editPaperNumberSuccess: {
    id: 'sp.signatureCollection:editPaperNumberSuccess',
    defaultMessage: 'Tókst að breyta blaðsíðunúmeri',
    description: '',
  },
  editPaperNumberError: {
    id: 'sp.signatureCollection:editPaperNumberError',
    defaultMessage: 'Ekki tókst að breyta blaðsíðunúmeri',
    description: '',
  },
  saveEditPaperNumber: {
    id: 'sp.signatureCollection:saveEditPaperNumber',
    defaultMessage: 'Uppfæra blaðsíðunúmer',
    description: '',
  },

  /* Parliamentary */
  collectionTitleParliamentary: {
    id: 'sp.signatureCollection:collectionTitleParliamentary',
    defaultMessage: 'Alþingiskosningar',
    description: '',
  },
  pageTitleParliamentary: {
    id: 'sp.signatureCollection:pageTitleParliamentary',
    defaultMessage: 'Meðmælasöfnun fyrir Alþingiskosningar',
    description: '',
  },
  infoProviderTooltip: {
    id: 'sp.signatureCollection:infoProviderTooltip',
    defaultMessage:
      'Þjóðskrá Íslands hefur umsjón með gögnum um meðmælasöfnun.',
  },
  add: {
    id: 'sp.signatureCollection:add',
    defaultMessage: 'Bæta við',
    description: '',
  },
  personName: {
    id: 'sp.signatureCollection:personName',
    defaultMessage: 'Nafn',
    description: '',
  },
  personNationalId: {
    id: 'sp.signatureCollection:personNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  nationalIdInvalid: {
    id: 'sp.signatureCollection:nationalIdInvalid',
    defaultMessage: 'Ógild kennitala',
    description: '',
  },
  addConstituency: {
    id: 'sp.signatureCollection:addConstituency',
    defaultMessage: 'Bæta við kjördæmi',
    description: '',
  },
  addConstituencyDescription: {
    id: 'sp.signatureCollection:addConstituencyDescription',
    defaultMessage:
      'Veldu viðeigandi kjördæmi sem þú vilt stofna meðmælendasöfnun í.',
    description: '',
  },
  addConstituencySuccess: {
    id: 'sp.signatureCollection:addConstituencySuccess',
    defaultMessage: 'Kjördæmi bætt við',
    description: '',
  },
  addConstituencyError: {
    id: 'sp.signatureCollection:addConstituencyError',
    defaultMessage: 'Ekki tókst að bæta við kjördæmi',
    description: '',
  },

  /* Municipal */
  collectionTitleMunicipal: {
    id: 'sp.signatureCollection:collectionTitleMunicipal',
    defaultMessage: 'Sveitarstjórnarkosningar',
    description: '',
  },
  collectionMunicipalListOwner: {
    id: 'sp.signatureCollection:collectionMunicipalListOwner',
    defaultMessage: 'Stofnandi söfnunar',
    description: '',
  },
  pageTitleMunicipal: {
    id: 'sp.signatureCollection:pageTitleMunicipal',
    defaultMessage: 'Meðmælasafnanir fyrir sveitarstjórnarkosningar',
    description: '',
  },
  pageIntro: {
    id: 'sp.signatureCollection:pageIntro',
    defaultMessage:
      'Hér eru upplýsingar um hlekk á söfnunina, stöðuna og yfirlit yfir umsjónaraðila.',
    description: '',
  },
  collectionIsActive: {
    id: 'sp.signatureCollection:collectionIsActive',
    defaultMessage: 'Söfnun í gangi',
    description: '',
  },
  managers: {
    id: 'sp.signatureCollection:managers',
    defaultMessage: 'Umsjónaraðilar',
    description: '',
  },
  managersDescription: {
    id: 'sp.signatureCollection:managersDescription#markdown',
    defaultMessage:
      'Hægt er að bæta við umsjónaraðilum með því að veita þeim umboð hér. Umsjónaraðilar hafa sömu aðgangsheimildir og stofnandi söfnunar en geta ekki eytt söfnuninni.',
    description: '',
  },
  noManagers: {
    id: 'sp.signatureCollection:noManagers',
    defaultMessage: 'Enginn umsjónaraðili skráður',
    description: '',
  },
  listActions: {
    id: 'sp.signatureCollection:listActions',
    defaultMessage: 'Aðgerðir',
    description: '',
  },
  listActionsDescription: {
    id: 'sp.signatureCollection:listActionsDescription',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu justo interdum, pharetra enim vel, ultrices augue.',
    description: '',
  },
  deleteCollection: {
    id: 'sp.signatureCollection:deleteCollection',
    defaultMessage: 'Eyða frambooði',
    description: '',
  },
  deleteCollectionDescription: {
    id: 'sp.signatureCollection:deleteCollectionDescription',
    defaultMessage:
      'Lorem ipsum dolor sit amet. Vestibulum tincidunt cursus viverra.',
    description: '',
  },
})
