import { defineMessages } from 'react-intl'

export const m = defineMessages({
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur imperdiet, dui eget iaculis vehicula, purus nibh lobortis urna, sit amet dignissim lacus metus non arcu.',
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
  myListsDescription: {
    id: 'sp.signatureCollection:myListsDescription',
    defaultMessage: 'Yfirlit safnanna sem þú hefur stofnað:',
    description: '',
  },
  copyLinkButton: {
    id: 'sp.signatureCollection:copyLinkButton',
    defaultMessage: 'Afrita hlekk',
    description: '',
  },
  copyLinkDescription: {
    id: 'sp.signatureCollection:copyLinkDescription',
    defaultMessage: 'Hér getur þú afritað hlekk á þitt framboð til að deila.',
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

  /* Signee View */
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
    defaultMessage: 'Já, hætta við söfnun meðmæla',
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
  downloadList: {
    id: 'sp.signatureCollection:downloadList',
    defaultMessage: 'Sækja lista',
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
})
