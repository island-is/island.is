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
  noEstatesFound: {
    id: 'sp.estates:no-estates-found',
    defaultMessage: 'Engin dánarbú fundust',
  },

  // Detail screen
  detailTitle: {
    id: 'sp.estates:detail-title',
    defaultMessage: 'Dánarbú',
  },
  deceasedName: {
    id: 'sp.estates:deceased-name',
    defaultMessage: 'Nafn látins',
  },
  deceasedNationalId: {
    id: 'sp.estates:deceased-national-id',
    defaultMessage: 'Kennitala látins',
  },
  dateOfDeath: {
    id: 'sp.estates:date-of-death',
    defaultMessage: 'Dánardagur hins látna',
  },
  // TODO: expose via API when estate(id) resolver is available
  domicile: {
    id: 'sp.estates:domicile',
    defaultMessage: 'Lögheimili',
  },
  // TODO: expose via API when estate(id) resolver is available
  assignedOffice: {
    id: 'sp.estates:assigned-office',
    defaultMessage: 'Embætti',
  },
  // TODO: expose via API when estate(id) resolver is available
  hasMarriageContract: {
    id: 'sp.estates:has-marriage-contract',
    defaultMessage: 'Kaupmáli',
  },
  // TODO: expose via API when estate(id) resolver is available
  hasWill: {
    id: 'sp.estates:has-will',
    defaultMessage: 'Erfðaskrá',
  },
  basicInfoTitle: {
    id: 'sp.estates:basic-info-title',
    defaultMessage: 'Grunnupplýsingar dánarbús',
  },
  estateAgent: {
    id: 'sp.estates:estate-agent',
    defaultMessage: 'Umboðsmaður dánarbús',
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
  nextStepsTitle: {
    id: 'sp.estates:next-steps-title',
    defaultMessage: 'Ákvörðun um skipti á dánarbúi',
  },
  nextStepsDescription: {
    id: 'sp.estates:next-steps-description',
    defaultMessage:
      'Senda þarf inn umsókn um leyfi til einkaskipta eða opinberra skipta til sýslumanns',
  },
  applicationNotSubmitted: {
    id: 'sp.estates:application-not-submitted',
    defaultMessage: 'Umsókn ekki send inn',
  },
  sendApplication: {
    id: 'sp.estates:send-application',
    defaultMessage: 'Senda umsókn',
  },
  deadline: {
    id: 'sp.estates:deadline',
    defaultMessage: 'Frestur',
  },
  deadlineTitle: {
    id: 'sp.estates:deadline-title',
    defaultMessage: 'Frestur varðandi skipti',
  },
  deadlineDescription: {
    id: 'sp.estates:deadline-description',
    defaultMessage:
      'Innan 4 mánaða frá andláti þarf að taka ákvörðun um skipti búss',
  },
  daysLeft: {
    id: 'sp.estates:days-left',
    defaultMessage: 'dagar eftir',
  },
  progressTimeline: {
    id: 'sp.estates:progress-timeline',
    defaultMessage: 'Framvinda skipta',
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
  filesTitle: {
    id: 'sp.estates:files-title',
    defaultMessage: 'Skjöl',
  },
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
  fileStatusReceived: {
    id: 'sp.estates:file-status-received',
    defaultMessage: 'Móttekið',
  },
  fileStatusPending: {
    id: 'sp.estates:file-status-pending',
    defaultMessage: 'Beðið',
  },
  fileStatusMissing: {
    id: 'sp.estates:file-status-missing',
    defaultMessage: 'Vantar',
  },
  fileSizeLabel: {
    id: 'sp.estates:file-size-label',
    defaultMessage: 'Stærð',
  },
  viewFile: {
    id: 'sp.estates:view-file',
    defaultMessage: 'Skoða skjal',
  },
  noFilesFound: {
    id: 'sp.estates:no-files-found',
    defaultMessage: 'Engin skjöl fundust',
  },
  fileName: {
    id: 'sp.estates:file-name',
    defaultMessage: 'Skjal',
  },
})
