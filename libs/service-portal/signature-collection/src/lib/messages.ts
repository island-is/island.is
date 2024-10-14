import { defineMessages } from 'react-intl'

export const m = defineMessages({
  /* Forsetakosningar */
  pageTitle: {
    id: 'sp.signatureCollection:title',
    defaultMessage: 'Meðmælasöfnun',
    description: '',
  },
  pageDescription: {
    id: 'sp.signatureCollection:description',
    defaultMessage:
      'Upplýsingar um það hvernig umboð er veitt - hvernig aðgangsstýringarnar virka. Linkur á aðgangsstýringu.',
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
    defaultMessage: 'Forsetakosningar 2024',
    description: '',
  },
  collectionTitleParliamentary: {
    id: 'sp.signatureCollection:collectionTitleParliamentary',
    defaultMessage: 'Alþingiskosningar',
    description: '',
  },
  myListsDescription: {
    id: 'sp.signatureCollection:myListsDescription',
    defaultMessage: 'Yfirlit safnana sem þú hefur stofnað',
    description: '',
  },
  myListsInfo: {
    id: 'sp.signatureCollection:myListsInfo#markdown',
    defaultMessage: 'Norðvesturkjördæmi - 7 þingsæti. 210 - 280 meðmæli.',
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
  signedTime: {
    id: 'sp.signatureCollection:signedTime',
    defaultMessage: 'Skrifað undir:',
    description: '',
  },
  uploadedTime: {
    id: 'sp.signatureCollection:uploadedTime',
    defaultMessage: 'Lesið inn:',
    description: '',
  },
  viewList: {
    id: 'sp.signatureCollection:viewList',
    defaultMessage: 'Skoða nánar',
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
    defaultMessage: 'Þú ert að fara að draga meðmælin þín til baka. Ertu viss?',
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
    id: 'sp.signatureCollection:actorNoAccessDescription',
    defaultMessage: 'Þú hefur ekki réttindi til að sjá þessar upplýsingar.',
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
  cancelCollectionModalConfirmButton: {
    id: 'sp.signatureCollection:modalConfirmButton',
    defaultMessage: 'Já, hætta við',
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
  numberOfSigns: {
    id: 'sp.signatureCollection:numberOfSigns',
    defaultMessage: 'Fjöldi meðmæla:',
    description: '',
  },
  coOwners: {
    id: 'sp.signatureCollection:coOwners',
    defaultMessage: 'Umboðsaðilar:',
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
  signeeAddress: {
    id: 'sp.signatureCollection:signeeAddress',
    defaultMessage: 'Heimilisfang',
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

  /* Parliamentary */
  parliamentaryElectionsTitle: {
    id: 'sp.signatureCollection:parliamentaryElectionsTitle',
    defaultMessage: 'Alþingiskosningar',
    description: '',
  },
  pageTitleParliamentary: {
    id: 'sp.signatureCollection:pageTitleParliamentary',
    defaultMessage: 'Meðmælasöfnun fyrir Alþingiskosningar',
    description: '',
  },
  pageDescriptionParliamentary: {
    id: 'sp.signatureCollection:pageDescriptionParliamentary',
    defaultMessage:
      'Hægt er að gera einstaklinga að umsjónaraðilum hér að neðan. Fjöldi meðmælenda er margfeldi af þingsætatölu hvers kjördæmis og 30 að lágmarki og 40 að hámarki. Söfnun lýkur 16.10.2024.',
    description: '',
  },
  infoProviderTooltip: {
    id: 'sp.signatureCollection:infoProviderTooltip',
    defaultMessage:
      'Þjóðskrá Íslands hefur umsjón með gögnum um meðmælasöfnun.',
  },
  supervisors: {
    id: 'sp.signatureCollection:supervisors',
    defaultMessage: 'Umsjónaraðilar',
    description: '',
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
  constituency: {
    id: 'sp.signatureCollection:constituency',
    defaultMessage: 'Kjördæmi',
    description: '',
  },
  allConstituencies: {
    id: 'sp.signatureCollection:allConstituencies',
    defaultMessage: 'Öll kjördæmi',
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
})
