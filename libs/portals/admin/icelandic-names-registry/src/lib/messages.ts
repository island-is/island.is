import { defineMessages } from 'react-intl'

export const m = defineMessages({
  rootName: {
    id: 'ap.icelandic-names-registry:title',
    defaultMessage: 'Mannanafnaskrá',
  },
  description: {
    id: 'ap.icelandic-names-registry:description',
    defaultMessage: 'Sýsla með íslensk mannanöfn.',
  },

  // Table
  tableHeadingName: {
    id: 'ap.icelandic-names-registry:table-heading-name',
    defaultMessage: 'Nafn',
  },
  tableHeadingType: {
    id: 'ap.icelandic-names-registry:table-heading-type',
    defaultMessage: 'Tegund',
  },
  tableHeadingStatus: {
    id: 'ap.icelandic-names-registry:table-heading-status',
    defaultMessage: 'Staða',
  },
  tableHeadingDescription: {
    id: 'ap.icelandic-names-registry:table-heading-description',
    defaultMessage: 'Lýsing',
  },
  tableHeadingVerdict: {
    id: 'ap.icelandic-names-registry:table-heading-verdict',
    defaultMessage: 'Úrskurður',
  },
  tableHeadingVisible: {
    id: 'ap.icelandic-names-registry:table-heading-visible',
    defaultMessage: 'Birt',
  },
  tableHeadingActions: {
    id: 'ap.icelandic-names-registry:table-heading-actions',
    defaultMessage: 'Aðgerðir',
  },

  // Notifications
  notificationNameAdded: {
    id: 'ap.icelandic-names-registry:notification-name-added',
    defaultMessage: 'Nafni var bætt við',
  },
  notificationNameUpdated: {
    id: 'ap.icelandic-names-registry:notification-name-updated',
    defaultMessage: 'Nafn var uppfært',
  },
  notificationNameDeleted: {
    id: 'ap.icelandic-names-registry:notification-name-deleted',
    defaultMessage: 'Nafni var eytt',
  },
  notificationError: {
    id: 'ap.icelandic-names-registry:notification-error',
    defaultMessage: 'Villa kom upp',
  },

  // Search
  searchName: {
    id: 'ap.icelandic-names-registry:search-name',
    defaultMessage: 'Nafnaleit',
  },
  searchForNameOrPartOfName: {
    id: 'ap.icelandic-names-registry:search-for-name-or-part-of-name',
    defaultMessage: 'Leitaðu að nafni eða hluta af nafni',
  },
  searchNothingFound: {
    id: 'ap.icelandic-names-registry:search-nothing-found',
    defaultMessage: 'Ekkert fannst með leitarstrengnum',
  },

  // Edit
  addName: {
    id: 'ap.icelandic-names-registry:add-name',
    defaultMessage: 'Bæta við nafni',
  },
  confirmDeleteName: {
    id: 'ap.icelandic-names-registry:confirm-delete-name',
    defaultMessage: 'Ertu viss um að þú viljir eyða nafninu',
  },
})
