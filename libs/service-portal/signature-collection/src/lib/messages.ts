import { defineMessages } from 'react-intl'

export const m = defineMessages({
  pageTitle: {
    id: 'sp.signatureCollection.information:title',
    defaultMessage: 'Meðmælalistar',
    description: '',
  },
  pageDescription: {
    id: 'sp.signatureCollection:description#markdown',
    defaultMessage:
      'Upplýsingar um það hvernig umboð er veitt - hvernig aðgangsstýringarnar virka. Linkur á aðgangsstýringu.',
    description: '',
  },
  createListButton: {
    id: 'sp.signatureCollection:createListButton',
    defaultMessage: 'Stofna meðmælalista',
    description: '',
  },
  myListsHeader: {
    id: 'sp.signatureCollection:myListsHeader',
    defaultMessage: 'Listar stofnaðir af mér',
    description: '',
  },
  collectionTitle: {
    id: 'sp.signatureCollection:collectionTitle',
    defaultMessage: 'Forsetakosningar 2024',
    description: '',
  },
  viewList: {
    id: 'sp.signatureCollection:viewList',
    defaultMessage: 'Skoða nánar',
    description: '',
  },

  /* Signee View */
  mySigneeListsHeader: {
    id: 'sp.signatureCollection:mySigneeListsHeader',
    defaultMessage: 'Listar sem ég hef mælt með',
    description: '',
  },
  mySigneeListsByAreaHeader: {
    id: 'sp.signatureCollection:mySigneeListsByAreaHeader',
    defaultMessage: 'Listar á mínu svæði sem hægt er að mæla með',
    description: '',
  },
  signList: {
    id: 'sp.signatureCollection:signList',
    defaultMessage: 'Mæla með lista',
    description: '',
  },
  unSignList: {
    id: 'sp.signatureCollection:unSignList',
    defaultMessage: 'Draga meðmæli mitt til baka',
    description: '',
  },
  unSignModalMessage: {
    id: 'sp.signatureCollection:modalMessage',
    defaultMessage: 'Þú ert að fara að draga meðmæli þitt til baka. Ertu viss?',
    description: '',
  },
  unSignModalConfirmButton: {
    id: 'sp.signatureCollection:unSignModalButton',
    defaultMessage: 'Já, draga meðmæli tilbaka',
    description: '',
  },

  /* Hætta við söfnun modal */
  cancelCollectionButton: {
    id: 'sp.signatureCollection:cancelCollectionButton',
    defaultMessage: 'Hætta við söfnun meðmæla',
    description: '',
  },
  cancelCollectionModalMessage: {
    id: 'sp.signatureCollection:modalMessage',
    defaultMessage: 'Þú ert að fara að hætta við söfnun meðmæla. Ertu viss?',
    description: '',
  },
  cancelCollectionModalConfirmButton: {
    id: 'sp.signatureCollection:modelConfirmButton',
    defaultMessage: 'Já, hætta við söfnun meðmæla',
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

  /* File Upload */
  uploadFile: {
    id: 'sp.signatureCollection:uploadFile',
    defaultMessage: 'Skila einning meðmælum á blaði',
    description: '',
  },
  uploadFileDescription: {
    id: 'sp.signatureCollection:uploadFileDescription#markdown',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non felis augue. Integer erat sapien, auctor ac porttitor ut, lacinia quis erat. Vivamus quis sollicitudin turpis. Aliquam erat volutpat. Donec ut ante malesuada, varius erat ut, scelerisque sapien. Sed in eros at purus sollicitudin feugiat non non arcu. Nullam at sapien eu nisi tempor pulvinar ut sed nibh. Sed ex libero, vestibulum vitae eros sit amet, sagittis cursus lacus.',
    description: '',
  },
  uploadHeader: {
    id: 'sp.signatureCollection:uploadHeader',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: '',
  },
  uploadText: {
    id: 'sp.signatureCollection:uploadText',
    defaultMessage: 'Tekið er við skjölum með endingu: .xlsx, .xls',
    description: '',
  },
  uploadButton: {
    id: 'sp.signatureCollection:uploadButton',
    defaultMessage: 'Velja skjöl',
    description: '',
  },
  uploadResultsHeader: {
    id: 'sp.signatureCollection:uploadResultsHeader',
    defaultMessage: 'Niðurstöður',
    description: '',
  },
  nationalIdsSuccess: {
    id: 'sp.signatureCollection:nationalIdsSuccess',
    defaultMessage: 'Kennitölur sem tókst að hlaða upp',
    description: '',
  },
  nationalIdsError: {
    id: 'sp.signatureCollection:nationalIdsError',
    defaultMessage: 'Kennitölur sem mistókst að hlaða upp',
    description: '',
  },
  tempMessage: {
    id: 'sp.signatureCollection:tempMessage',
    defaultMessage: 'Tempus facilisis',
    description: '',
  },
})
