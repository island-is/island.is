import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  foundSingular: {
    id: 'sp.documents:found-singular',
    defaultMessage: 'skjal fannst',
  },
  found: {
    id: 'sp.documents:found',
    defaultMessage: 'skjöl fundust',
  },
  title: {
    id: 'sp.documents:title',
    defaultMessage: 'Pósthólf',
  },
  intro: {
    id: 'sp.documents:intro',
    defaultMessage:
      'Hér getur þú fundið skjöl sem send hafa verið til þín frá opinberum aðilum.',
  },
  onlyShowUnread: {
    id: 'sp.documents:only-show-unread',
    defaultMessage: 'Sýna einungis ólesið',
  },
  onlyShowArchived: {
    id: 'sp.documents:only-show-archived',
    defaultMessage: 'Geymsla',
  },
  onlyShowBookmarked: {
    id: 'sp.documents:only-show-bookmarked',
    defaultMessage: 'Stjörnumerkt',
  },
  onlyShowUnreadShort: {
    id: 'sp.documents:only-show-unread-short',
    defaultMessage: 'Sýna ólesið',
  },
  institutionLabel: {
    id: 'sp.documents:institution-label',
    defaultMessage: 'Stofnun',
  },
  groupLabel: {
    id: 'sp.documents:group-label',
    defaultMessage: 'Flokkur',
  },
  clearFilters: {
    id: 'sp.documents:clear-filters',
    defaultMessage: 'Hreinsa síu',
  },
  tableHeaderDate: {
    id: 'sp.documents:table-header-date',
    defaultMessage: 'Dagsetning',
  },
  tableHeaderInformation: {
    id: 'sp.documents:table-header-information',
    defaultMessage: 'Upplýsingar',
  },
  tableHeaderInstitution: {
    id: 'sp.documents:table-header-institution',
    defaultMessage: 'Stofnun',
  },
  tableHeaderGroup: {
    id: 'sp.documents:table-header-group',
    defaultMessage: 'Flokkur',
  },
  notFound: {
    id: 'sp.documents:not-found',
    defaultMessage: 'Engin skjöl fundust fyrir gefin leitarskilyrði.',
  },
  error: {
    id: 'sp.documents:error',
    defaultMessage: 'Tókst ekki að sækja rafræn skjöl, eitthvað fór úrskeiðis.',
  },
  documentErrorLoad: {
    id: 'sp.documents:document-error-loading',
    defaultMessage: 'Villa í birtingu skjals',
  },
  documentDisplayError: {
    id: 'sp.documents:fetch-error',
    defaultMessage:
      'Ekki tókst að birta umbeðið skjal, við bendum þér á að prófa að sækja skjalið. Ef ekki tekst að sækja skal beina fyrirspurn til sendanda skjals: {senderName}',
  },
  documentFetchError: {
    id: 'sp.documents:fetch-error-2',
    defaultMessage:
      'Ekki tókst að sækja umbeðið skjal, við bendum þér á að beina fyrirspurn til sendanda þess: {senderName}',
  },
  pickDocument: {
    id: 'sp.documents:pick-document',
    defaultMessage: 'Veldu skjal til að lesa',
  },
  markAsBulkSelection: {
    id: 'sp.documents:mark-as-bulk-selection',
    defaultMessage: 'Merkja skjal fyrir fjöldaframkvæmd',
  },
  goToPage: {
    id: 'sp.documents:go-to-page',
    defaultMessage: 'Fara á síðu {page}',
  },
  selectAll: {
    id: 'sp.documents:select-all',
    defaultMessage: 'Velja allt',
  },
  successArchiveMulti: {
    id: 'sp.documents:success-archive-messages',
    defaultMessage: 'Skjöl sett í geymslu',
  },
  successArchive: {
    id: 'sp.documents:success-archive-message',
    defaultMessage: 'Skjal sett í geymslu',
  },
  successUnarchive: {
    id: 'sp.documents:success-unarchive-message',
    defaultMessage: 'Skjal tekið úr geymslu',
  },
  documentSearchLabel: {
    id: 'sp.documents:search-label',
    defaultMessage: 'Leita',
  },
  caseNumber: {
    id: 'sp.documents:case-number',
    defaultMessage: 'Málsnúmer:',
  },
  caseNumberShort: {
    id: 'sp.documents:case-number-short',
    defaultMessage: 'Málsnr.',
  },
  sentToEmail: {
    id: 'sp.documents:sent-to-email',
    defaultMessage: 'Sent á tölvupóstfang',
  },
  message: {
    id: 'sp.documents:message',
    defaultMessage: 'Skilaboð',
  },
  from: {
    id: 'sp.documents:from',
    defaultMessage: 'Frá',
  },
  fromWithArgs: {
    id: 'sp.documents:from-with-args',
    defaultMessage: 'Frá: {senderName}',
  },
  toWithArgs: {
    id: 'sp.documents:to-with-args',
    defaultMessage: 'Til: {receiverName}',
  },
  titleWord: {
    id: 'sp.documents:title-word',
    defaultMessage: 'Titill',
  },
  pleaseRegisterEmail: {
    id: 'sp.documents:please-register-email',
    defaultMessage: 'Vinsamlegast skráðu tölvupóstfang',
  },
  showAllRepliesWithArgs: {
    id: 'sp.documents:show-all-replies-with-args',
    defaultMessage: 'Sýna öll samskipti ({repliesLength})',
  },
  zoomIn: {
    id: 'sp.documents:zoom-in',
    defaultMessage: 'Auka þysjunarstig í {arg} ',
  },
  zoomOut: {
    id: 'sp.documents:zoom-out',
    defaultMessage: 'Minnka þysjunarstig í {arg} ',
  },
  currentZoomLevel: {
    id: 'sp.documents:current-zoom-level',
    defaultMessage: 'Núverandi þysjustig',
  },
  openExpandedModal: {
    id: 'sp.documents:expand-expanded-modal',
    defaultMessage: 'Opna módal með stækkuðu skjali ',
  },
  closeExpandedModal: {
    id: 'sp.documents:close',
    defaultMessage: 'Loka módal með stækkuðu skjali',
  },
  replySent: {
    id: 'sp.documents:reply-sent',
    defaultMessage:
      'Skilaboðin eru móttekin og mál hefur verið stofnað. Þú getur haldið áfram samskiptunum hér eða í gegnum þitt persónulega netfang {email}. Málsnúmerið er: {caseNumber}',
  },
  sendMessage: {
    id: 'sp.documents:send-message',
    defaultMessage: 'Svara',
  },
  closedForReplies: {
    id: 'sp.documents:closed-for-replies',
    defaultMessage:
      'Ekki er hægt að svara þessum skilaboðum því sendandi hefur lokað fyrir frekari svör í þessu samtali.',
  },
  replySentError: {
    id: 'sp.documents:reply-sent-error',
    defaultMessage:
      'Ekki tókst að senda skilaboð, vinsamlegast reynið aftur síðar.',
  },
  replySentShort: {
    id: 'sp.documents:reply-sent',
    defaultMessage: 'Skilaboð send',
  },
  replyCannotBeEmpty: {
    id: 'sp.documents:reply-cannot-be-empty',
    defaultMessage: 'Skilaboð mega ekki vera tóm',
  },
  replyCannotBeMore: {
    id: 'sp.documents:reply-cannot-be-more-than-500',
    defaultMessage: 'Skilaboð mega ekki vera meira en 500 stafir',
  },
  messagesHere: {
    id: 'sp.documents:messages-here',
    defaultMessage: 'Skilaboð hér',
  },
  replyEmailTooltip: {
    id: 'sp.documents:reply-email-tooltip',
    defaultMessage: 'Netfang sem er skráð í Mínar stillingar. ',
  },
  emailMissing: {
    id: 'sp.documents:email-missing',
    defaultMessage:
      'Nauðsynlegt er að hafa netfang skráð til að senda skilaboðin',
  },
})
