import { defineMessages } from 'react-intl'

export const m = defineMessages({
  petitionListsOverview: {
    id: 'admin-portal.petition:petitionListsOverview',
    defaultMessage: 'Yfirlit undirskriftalista',
    description: '',
  },
  petitionsOverview: {
    id: 'admin-portal.petition:petitionsOverview',
    defaultMessage: 'Yfirlit undirskrifta',
    description: '',
  },
  petitionList: {
    id: 'admin-portal.petition:petitionList',
    defaultMessage: 'Undirskriftalisti',
    description: '',
  },

  // Overview
  petitionsTitle: {
    id: 'admin-portal.petition:petitionsTitle',
    defaultMessage: 'Undirskriftalistar',
    description: '',
  },
  intro: {
    id: 'admin-portal.petition:overview',
    defaultMessage: 'Yfirlit yfir virka, liðna og læsta undirskriftalista.',
    description: '',
  },
  openLists: {
    id: 'admin-portal.petition:openLists',
    defaultMessage: 'Virkir listar',
    description: '',
  },
  outdatedLists: {
    id: 'admin-portal.petition:outdatedLists',
    defaultMessage: 'Liðnir listar',
    description: '',
  },
  lockedLists: {
    id: 'admin-portal.petition:lockedLists',
    defaultMessage: 'Læstir listar',
    description: '',
  },
  viewList: {
    id: 'admin-portal.petition:viewList',
    defaultMessage: 'Skoða lista',
    description: '',
  },
  listPeriod: {
    id: 'admin-portal.petition:listPeriod',
    defaultMessage: 'Gildistímabil lista: ',
    description: '',
  },
  listOwner: {
    id: 'admin-portal.petition:listOwner',
    defaultMessage: 'Ábyrgðarmaður:',
    description: '',
  },

  // Petition List
  downloadPetitions: {
    id: 'admin-portal.petition:downloadPetitions',
    defaultMessage: 'Sækja lista',
    description: '',
  },
  asPdf: {
    id: 'admin-portal.petition:asPdf',
    defaultMessage: 'Sem PDF',
    description: '',
  },
  asCsv: {
    id: 'admin-portal.petition:asCsv',
    defaultMessage: 'Sem CSV',
    description: '',
  },
  goBack: {
    id: 'admin-portal.petition:goBack',
    defaultMessage: 'Til baka',
    description: '',
  },
  listName: {
    id: 'admin-portal.petition:listName',
    defaultMessage: 'Heiti lista',
    description: '',
  },
  listDescription: {
    id: 'admin-portal.petition:listDescription',
    defaultMessage: 'Um lista',
    description: '',
  },
  listOpenFrom: {
    id: 'admin-portal.petition:listOpenFrom',
    defaultMessage: 'Tímabil frá',
    description: '',
  },
  listOpenTil: {
    id: 'admin-portal.petition:listOpenTil',
    defaultMessage: 'Tímabil til',
    description: '',
  },
  selectDate: {
    id: 'admin-portal.petition:selectDate',
    defaultMessage: 'Veldu dagsetningu',
    description: '',
  },
  listIsLocked: {
    id: 'admin-portal.petition:listIsClosed',
    defaultMessage: 'Listi er læstur',
    description: '',
  },
  listIsLockedMessage: {
    id: 'admin-portal.petition:listIsLockedMessage',
    defaultMessage:
      'Læstur listi er ekki sýnilegur og ekki er hægt að bæta við undirskriftum.',
    description: '',
  },
  date: {
    id: 'admin-portal.petition:date',
    defaultMessage: 'Dagsetning',
    description: '',
  },
  name: {
    id: 'admin-portal.petition:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  locality: {
    id: 'admin-portal.petition:locality',
    defaultMessage: 'Sveitarfélag',
    description: '',
  },
  noName: {
    id: 'admin-portal.petition:noName',
    defaultMessage: 'Nafn ekki skráð',
    description: '',
  },
  noSignatures: {
    id: 'admin-portal.petition:noSignatures',
    defaultMessage: 'Engar undirskriftir',
    description: '',
  },

  // Lock list
  lockList: {
    id: 'admin-portal.petition:lockList',
    defaultMessage: 'Læsa lista',
    description: '',
  },
  lockListMessage: {
    id: 'admin-portal.petition:lockListMessage',
    defaultMessage:
      'Við að læsa lista þá verður hann ekki sýnilegur og ekki hægt að skrá sig á hann. Einnig fær ábyrgðamaður tilkynningu með pósti um að lista hafi verið læst.',
    description: '',
  },
  lockListQuestion: {
    id: 'admin-portal.petition:lockListMessage',
    defaultMessage: 'Ertu viss um að vilja læsa lista?',
    description: '',
  },

  // Unlock list
  unlockList: {
    id: 'admin-portal.petition:unlockList',
    defaultMessage: 'Aflæsa lista',
    description: '',
  },
  unlockListMessage: {
    id: 'admin-portal.petition:unlockListMessage',
    defaultMessage:
      'Við að aflæsa lista verður hann aftur sýnilegur og hægt verður að setja nafn sitt á lista.',
    description: '',
  },
  unlockListQuestion: {
    id: 'admin-portal.petition:unlockListQuestion',
    defaultMessage: 'Ertu viss um að vilja aflæsa lista?',
    description: '',
  },
  updateList: {
    id: 'admin-portal.petition:updateList',
    defaultMessage: 'Uppfæra lista',
    description: '',
  },
  modalCancel: {
    id: 'admin-portal.petition:modalCancel',
    defaultMessage: 'Hætta við',
    description: '',
  },

  // Toast messages
  toastUpdateSuccess: {
    id: 'admin-portal.petition:toastUpdateSuccess',
    defaultMessage: 'Tókst að uppfæra lista',
    description: '',
  },
  toastUpdateError: {
    id: 'admin-portal.petition:toastUpdateSuccess',
    defaultMessage: 'Ekki tókst að uppfæra lista',
    description: '',
  },
  toastLockSuccess: {
    id: 'admin-portal.petition:toastLockSuccess',
    defaultMessage: 'Tókst að læsa lista',
    description: '',
  },
  toastLockError: {
    id: 'admin-portal.petition:toastLockError',
    defaultMessage: 'Ekki tókst að læsa lista',
    description: '',
  },
  toastUnlockSuccess: {
    id: 'admin-portal.petition:toastUnlockSuccess',
    defaultMessage: 'Tókst að aflæsa lista',
    description: '',
  },
  toastUnlockError: {
    id: 'admin-portal.petition:toastUnlockError',
    defaultMessage: 'Ekki tókst að aflæsa lista',
    description: '',
  },
})
