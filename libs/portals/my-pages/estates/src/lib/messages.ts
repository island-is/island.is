import { defineMessages } from 'react-intl'

export const estatesMessages = defineMessages({
  title: {
    id: 'sp.estates:title',
    defaultMessage: 'Mín dánarbú',
  },
  intro: {
    id: 'sp.estates:intro',
    defaultMessage:
      'Hér eru gögn um dánarbú sem þú hefur aðgengi að sem sótt eru til Sýslumanns.',
  },
  infoButtonLabel: {
    id: 'sp.estates:info-button-label',
    defaultMessage: 'Gagnlegar upplýsingar',
  },
  infoButtonUrl: {
    id: 'sp.estates:info-button-url',
    defaultMessage: 'https://island.is/danarbu',
  },
  searchPlaceholder: {
    id: 'sp.estates:search-placeholder',
    defaultMessage: 'Sía eftir leitarorði',
  },
  showFinished: {
    id: 'sp.estates:show-finished',
    defaultMessage: 'Sýna lokin dánarbú',
  },
  caseNumber: {
    id: 'sp.estates:case-number',
    defaultMessage: 'Málsnúmer',
  },
  statusInProgress: {
    id: 'sp.estates:status-in-progress',
    defaultMessage: 'Í vinnslu',
  },
  statusFinished: {
    id: 'sp.estates:status-finished',
    defaultMessage: 'Lokið',
  },
  view: {
    id: 'sp.estates:view',
    defaultMessage: 'Skoða',
  },
  resultCount: {
    id: 'sp.estates:result-count',
    defaultMessage: '{count, plural, one {# niðurstaða} other {# niðurstöður}}',
  },
  noEstatesFound: {
    id: 'sp.estates:no-estates-found',
    defaultMessage: 'Engin dánarbú fundust',
  },

  // Detail screen
  basicInfoTitle: {
    id: 'sp.estates:basic-info-title',
    defaultMessage: 'Grunnupplýsingar dánarbús',
  },
  tabHeirs: {
    id: 'sp.estates:tab-heirs',
    defaultMessage: 'Erfingjar',
  },
  heirName: {
    id: 'sp.estates:heir-name',
    defaultMessage: 'Nafn',
  },
  heirNationalId: {
    id: 'sp.estates:heir-national-id',
    defaultMessage: 'Kennitala',
  },
  heirRelation: {
    id: 'sp.estates:heir-relation',
    defaultMessage: 'Tengsl',
  },
  nextSteps: {
    id: 'sp.estates:next-steps',
    defaultMessage: 'Næstu skref',
  },
  deadline: {
    id: 'sp.estates:deadline',
    defaultMessage: 'Frestur',
  },
  daysLeft: {
    id: 'sp.estates:days-left',
    defaultMessage:
      '{count, plural, one {# dagur eftir} other {# dagar eftir}}',
  },
  submitDocuments: {
    id: 'sp.estates:submit-documents',
    defaultMessage: 'Skila inn gögnum',
  },
  grantAuthorization: {
    id: 'sp.estates:grant-authorization',
    defaultMessage: 'Veita umboð',
  },
  seeFiles: {
    id: 'sp.estates:see-files',
    defaultMessage: 'Opna skjöl',
  },

  // Files screen
  filesIntro: {
    id: 'sp.estates:files-intro',
    defaultMessage:
      'Hér geta erfingjar eða umboðsmenn þeirra nálgast þau skjöl og gögn sem borist hafa Sýslumanni rafrænt.',
  },
  filesButtonLabel: {
    id: 'sp.estates:files-button-label',
    defaultMessage: 'Skila inn gögnum',
  },
  filesButtonUrl: {
    id: 'sp.estates:files-button-url',
    defaultMessage: 'https://island.is/danarbu/skila-gognum',
  },
  noFilesFound: {
    id: 'sp.estates:no-files-found',
    defaultMessage: 'Engin skjöl fundust',
  },
})
