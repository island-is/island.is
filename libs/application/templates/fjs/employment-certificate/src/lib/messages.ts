import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'fjs.ec.application:name',
    defaultMessage: 'Umsókn um starfsvottorð vegna starfa hjá ríkinu',
    description: `Application's name`,
  },
  institutionName: {
    id: 'fjs.ec.application:institutionName',
    defaultMessage: 'Fjársýsla ríkisins',
    description: `Institution's name`,
  },
  stateMetaNamePrerequisites: {
    id: 'fjs.ec.application:stateMetaNamePrerequisites',
    defaultMessage: 'Gagnaöflun',
    description: 'Meta name of the application state during data collection',
  },
  stateMetaNameDraft: {
    id: 'fjs.ec.application:stateMetaNameDraft',
    defaultMessage: 'Umsókn',
    description: 'Meta name of the application state while in draft',
  },
  stateMetaNameSubmissionFailed: {
    id: 'fjs.ec.application:stateMetaNameSubmissionFailed',
    defaultMessage: 'Ekki tókst að senda',
    description:
      'Meta name of the application state after the request could not be sent',
  },
  stateMetaNameCompleted: {
    id: 'fjs.ec.application:stateMetaNameCompleted',
    defaultMessage: 'Lokið',
    description:
      'Meta name of the application state when the certificate was sent to the mailbox',
  },
  stateMetaNameProcessing: {
    id: 'fjs.ec.application:stateMetaNameProcessing',
    defaultMessage: 'Móttekin',
    description:
      'Meta name of the application state when Fjársýsla ríkisins received the request and processes it',
  },
  stateMetaNameClosed: {
    id: 'fjs.ec.application:stateMetaNameClosed',
    defaultMessage: 'Lokað',
    description:
      'Meta name of the application state when the case was closed without a certificate',
  },
  submitButton: {
    id: 'fjs.ec.application:submitButton',
    defaultMessage: 'Senda umsókn',
    description: 'Label of the button that sends the application',
  },
})

export const sections = defineMessages({
  externalData: {
    id: 'fjs.ec.application:sections.externalData',
    defaultMessage: 'Gagnaöflun',
    description: 'Stepper title of the data collection section',
  },
  personalInformation: {
    id: 'fjs.ec.application:sections.personalInformation',
    defaultMessage: 'Persónuupplýsingar',
    description: 'Stepper title of the personal information section',
  },
  employmentHistory: {
    id: 'fjs.ec.application:sections.employmentHistory',
    defaultMessage: 'Starfsferill',
    description: 'Stepper title of the employment history section',
  },
  conclusion: {
    id: 'fjs.ec.application:sections.conclusion',
    defaultMessage: 'Niðurstaða',
    description: 'Stepper title of the result section',
  },
})

export const prerequisites = defineMessages({
  title: {
    id: 'fjs.ec.application:prerequisites.title',
    defaultMessage: 'Umsókn um starfsvottorð vegna starfa hjá ríkinu',
    description: 'Title of the data collection screen',
  },
  checkboxLabel: {
    id: 'fjs.ec.application:prerequisites.checkboxLabel',
    defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
    description: 'Label of the checkbox that approves the data collection',
  },
  nationalRegistryTitle: {
    id: 'fjs.ec.application:prerequisites.nationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'Title of the National Registry data provider',
  },
  nationalRegistrySubTitle: {
    id: 'fjs.ec.application:prerequisites.nationalRegistrySubTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina.',
    description: 'Description of the National Registry data provider',
  },
  userProfileTitle: {
    id: 'fjs.ec.application:prerequisites.userProfileTitle',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Title of the user profile data provider',
  },
  userProfileSubTitle: {
    id: 'fjs.ec.application:prerequisites.userProfileSubTitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum.',
    description: 'Description of the user profile data provider',
  },
  employmentHistoryTitle: {
    id: 'fjs.ec.application:prerequisites.employmentHistoryTitle',
    defaultMessage: 'Starfssaga hjá ríkinu',
    description: 'Title of the employment history data provider',
  },
  employmentHistorySubTitle: {
    id: 'fjs.ec.application:prerequisites.employmentHistorySubTitle',
    defaultMessage:
      'Upplýsingar um störf þín hjá ríkinu eru sóttar úr starfssögugrunni Fjársýslu ríkisins.',
    description: 'Description of the employment history data provider',
  },
  submitButton: {
    id: 'fjs.ec.application:prerequisites.submitButton',
    defaultMessage: 'Staðfesta',
    description: 'Label of the button that confirms the data collection',
  },
})

export const personalInformation = defineMessages({
  title: {
    id: 'fjs.ec.application:personalInformation.title',
    defaultMessage: 'Persónuupplýsingar',
    description: 'Title of the personal information screen',
  },
  applicantTitle: {
    id: 'fjs.ec.application:personalInformation.applicantTitle',
    defaultMessage: 'Umsækjandi',
    description: 'Subtitle above the applicant fields',
  },
  emailError: {
    id: 'fjs.ec.application:personalInformation.emailError',
    defaultMessage: 'Netfangið er ekki gilt',
    description:
      'Error shown when the email from the user profile is not valid',
  },
})

export const employmentHistory = defineMessages({
  title: {
    id: 'fjs.ec.application:employmentHistory.title',
    defaultMessage: 'Starfsferill',
    description: 'Title of the employment history screen',
  },
  description: {
    id: 'fjs.ec.application:employmentHistory.description',
    defaultMessage:
      'Samkvæmt gögnum Fjársýslu ríkisins hefur þú starfað hjá eftirtöldum stofnunum.\n\nVeldu hvaða stofnanir eiga að koma fram á vottorðinu.',
    description: 'Intro text of the employment history screen (Markdown)',
  },
  institutionColumn: {
    id: 'fjs.ec.application:employmentHistory.institutionColumn',
    defaultMessage: 'Stofnun',
    description: 'Table header: the government institution',
  },
  fromColumn: {
    id: 'fjs.ec.application:employmentHistory.fromColumn',
    defaultMessage: 'Upphaf',
    description: 'Table header: the earliest start date at the institution',
  },
  toColumn: {
    id: 'fjs.ec.application:employmentHistory.toColumn',
    defaultMessage: 'Lok',
    description: 'Table header: the latest end date at the institution',
  },
  selectColumn: {
    id: 'fjs.ec.application:employmentHistory.selectColumn',
    defaultMessage: 'Á vottorði',
    description:
      'Screen reader header of the checkbox column (the checkbox puts the institution on the certificate)',
  },
  noEndDate: {
    id: 'fjs.ec.application:employmentHistory.noEndDate',
    defaultMessage: 'Í starfi',
    description: 'Shown instead of an end date when the job has not ended',
  },
  institutionPeriod: {
    id: 'fjs.ec.application:employmentHistory.institutionPeriod',
    defaultMessage: 'Upphaf: {from} · Lok: {to}',
    description: 'Start and end date of an institution on a mobile card',
  },
  includeInstitution: {
    id: 'fjs.ec.application:employmentHistory.includeInstitution',
    defaultMessage: 'Birta {name} á vottorðinu',
    description: 'Screen reader label of the checkbox of one institution',
  },
  selectedCount: {
    id: 'fjs.ec.application:employmentHistory.selectedCount',
    defaultMessage:
      '{selected} af {total} {total, plural, one {stofnun} other {stofnunum}} {selected, plural, one {verður} other {verða}} á vottorðinu.',
    description:
      'How many of the institutions will be on the certificate, e.g. "2 af 3 stofnunum verða á vottorðinu."',
  },
  noneSelectedError: {
    id: 'fjs.ec.application:employmentHistory.noneSelectedError',
    defaultMessage: 'Veldu að minnsta kosti eina stofnun.',
    description: 'Error when no institution is ticked',
  },
  tableCaption: {
    id: 'fjs.ec.application:employmentHistory.tableCaption',
    defaultMessage: 'Stofnanir á starfsferli hjá ríkinu',
    description: 'Screen reader caption of the institution table',
  },
  loading: {
    id: 'fjs.ec.application:employmentHistory.loading',
    defaultMessage: 'Sæki starfsferil…',
    description: 'Screen reader text while the history is loading',
  },
  previewChangedTitle: {
    id: 'fjs.ec.application:employmentHistory.previewChangedTitle',
    defaultMessage: 'Starfsferillinn hefur breyst',
    description:
      'Title shown when the history changed after the applicant saw it',
  },
  previewChangedMessage: {
    id: 'fjs.ec.application:employmentHistory.previewChangedMessage',
    defaultMessage:
      'Upplýsingarnar breyttust eftir að þú skoðaðir þær. Farðu yfir starfsferilinn aftur áður en þú sendir umsóknina.',
    description:
      'Text shown when the history changed after the applicant saw it',
  },
  fetchErrorTitle: {
    id: 'fjs.ec.application:employmentHistory.fetchErrorTitle',
    defaultMessage: 'Ekki er hægt að senda umsóknina',
    description: 'Title shown when the history could not be fetched',
  },
  fetchErrorMessage: {
    id: 'fjs.ec.application:employmentHistory.fetchErrorMessage',
    defaultMessage:
      'Villa kom upp við að sækja starfsferilinn. Reyndu aftur. Ef villan kemur upp aftur, sendu tölvupóst á [starfsvottord@fjs.is](mailto:starfsvottord@fjs.is).\n\nUmsóknin hefur ekki verið send.',
    description:
      'Text shown when the history could not be fetched (Markdown; Fjársýsla ríkisins must confirm the contact details)',
  },
  retryButton: {
    id: 'fjs.ec.application:employmentHistory.retryButton',
    defaultMessage: 'Reyna aftur',
    description: 'Button that fetches the history again',
  },
  includeUnionLabel: {
    id: 'fjs.ec.application:employmentHistory.includeUnionLabel',
    defaultMessage: 'Birta stéttarfélag á vottorðinu',
    description: 'Checkbox that puts the trade union on the certificate',
  },
  includeUnionSubLabel: {
    id: 'fjs.ec.application:employmentHistory.includeUnionSubLabel',
    defaultMessage: 'Getur verið gagnlegt ef starfsheiti vantar.',
    description: 'Hint under the trade-union checkbox',
  },
  supportTitle: {
    id: 'fjs.ec.application:employmentHistory.supportTitle',
    defaultMessage: 'Vantar upplýsingar eða er eitthvað rangt?',
    description: 'Title of the info box about missing or wrong information',
  },
  supportMessage: {
    id: 'fjs.ec.application:employmentHistory.supportMessage',
    defaultMessage:
      'Ef stofnun vantar eða dagsetningar eru rangar geturðu sent athugasemd með umsókninni. Fjársýslan fer þá yfir málið áður en vottorðið er gefið út.\n\nVottorðið nær ekki til starfa hjá sveitarfélögum, t.d. Reykjavíkurborg, eða hjá Póstinum. Vegna þeirra starfa þarftu að óska eftir vottorði hjá viðkomandi vinnuveitanda.',
    description:
      'Text of the info box about missing or wrong information (Markdown; Fjársýsla ríkisins must confirm it)',
  },
  commentLabel: {
    id: 'fjs.ec.application:employmentHistory.commentLabel',
    defaultMessage: 'Athugasemd (valfrjálst)',
    description: 'Label of the optional comment',
  },
  commentPlaceholder: {
    id: 'fjs.ec.application:employmentHistory.commentPlaceholder',
    defaultMessage: 'Skrifaðu athugasemd ef upplýsingar vantar eða eru rangar.',
    description: 'Placeholder of the optional comment',
  },
  commentHint: {
    id: 'fjs.ec.application:employmentHistory.commentHint',
    defaultMessage:
      'Ef þú bætir við athugasemd fer umsóknin í handvirka yfirferð hjá Fjársýslunni.',
    description: 'Hint under the optional comment',
  },
  commentTooLong: {
    id: 'fjs.ec.application:employmentHistory.commentTooLong',
    defaultMessage: 'Athugasemdin má mest vera {max, number} stafir.',
    description: 'Error when the comment is longer than the limit',
  },
})

export const conclusion = defineMessages({
  title: {
    id: 'fjs.ec.application:conclusion.title',
    defaultMessage: 'Niðurstaða',
    description: 'Title of the result screens',
  },
  whatNextHeader: {
    id: 'fjs.ec.application:conclusion.whatNextHeader',
    defaultMessage: 'Hvað gerist næst?',
    description: 'Header of the expandable "what happens next" box',
  },
  whatNextIntro: {
    id: 'fjs.ec.application:conclusion.whatNextIntro',
    defaultMessage:
      'Upplýsingar um hvar þú getur skoðað og sótt starfsvottorðið þitt.',
    description: 'Intro of the "what happens next" box when sent or processing',
  },
  whatNextDescription: {
    id: 'fjs.ec.application:conclusion.whatNextDescription',
    defaultMessage:
      'Starfsvottorðið er birt í stafræna pósthólfinu þínu á Mínum síðum á Ísland.is. Þar geturðu opnað það og sótt það sem PDF-skjal.',
    description:
      'Content of the "what happens next" box (Markdown). Placeholder until the design gives the text.',
  },
  reviewWhatNextIntro: {
    id: 'fjs.ec.application:conclusion.reviewWhatNextIntro',
    defaultMessage:
      'Fjársýslan fer yfir umsóknina og hefur samband ef þörf krefur.',
    description:
      'Intro of the "what happens next" box when the comment is reviewed',
  },
  reviewWhatNextDescription: {
    id: 'fjs.ec.application:conclusion.reviewWhatNextDescription',
    defaultMessage:
      'Ef hægt er að gefa út vottorð verður það birt í stafræna pósthólfinu þínu á Mínum síðum á Ísland.is.',
    description:
      'Content of the "what happens next" box when the comment is reviewed (Markdown). Placeholder until the design gives the text.',
  },
  myPagesButton: {
    id: 'fjs.ec.application:conclusion.myPagesButton',
    defaultMessage: 'Fara á Mínar síður',
    description: 'Button that opens My pages',
  },
  sentTitle: {
    id: 'fjs.ec.application:conclusion.sentTitle',
    defaultMessage: 'Vottorðið hefur verið sent',
    description: 'Title when the certificate was delivered to the mailbox',
  },
  sentMessage: {
    id: 'fjs.ec.application:conclusion.sentMessage',
    defaultMessage:
      'Starfsvottorðið þitt hefur verið útbúið og sent í stafræna pósthólfið þitt. Þar geturðu skoðað vottorðið og sótt það sem PDF-skjal.',
    description: 'Text when the certificate was delivered to the mailbox',
  },
  certificateLink: {
    id: 'fjs.ec.application:conclusion.certificateLink',
    defaultMessage: 'Starfsvottorð – {name} / {date}',
    description: 'Link to the certificate in the mailbox',
  },
  pdfTag: {
    id: 'fjs.ec.application:conclusion.pdfTag',
    defaultMessage: 'PDF',
    description: 'Tag on the link to the certificate',
  },
  mailboxMessage: {
    id: 'fjs.ec.application:conclusion.mailboxMessage',
    defaultMessage:
      'Opnaðu stafræna pósthólfið þitt til að skoða eða sækja starfsvottorðið.',
    description: 'Text next to the button that opens the mailbox',
  },
  mailboxButton: {
    id: 'fjs.ec.application:conclusion.mailboxButton',
    defaultMessage: 'Opna pósthólfið',
    description: 'Button that opens the mailbox',
  },
  processingTitle: {
    id: 'fjs.ec.application:conclusion.processingTitle',
    defaultMessage: 'Umsókn móttekin – í vinnslu',
    description: 'Title when Fjársýsla ríkisins accepted the request (202)',
  },
  processingMessage: {
    id: 'fjs.ec.application:conclusion.processingMessage',
    defaultMessage:
      'Verið er að vinna úr umsókninni þinni. Þú þarft ekki að sækja um aftur. Þegar vinnslu er lokið færðu niðurstöðuna í stafræna pósthólfið þitt.',
    description: 'Text when Fjársýsla ríkisins accepted the request (202)',
  },
  processingActionMessage: {
    id: 'fjs.ec.application:conclusion.processingActionMessage',
    defaultMessage:
      'Þú getur farið á Mínar síður og opnað stafræna pósthólfið þitt þegar vottorðið er tilbúið.',
    description: 'Text next to the My pages button while processing',
  },
  commentReviewTitle: {
    id: 'fjs.ec.application:conclusion.commentReviewTitle',
    defaultMessage: 'Umsókn móttekin – athugasemd í yfirferð',
    description: 'Title when the request with a comment was accepted (202)',
  },
  commentReviewMessage: {
    id: 'fjs.ec.application:conclusion.commentReviewMessage',
    defaultMessage:
      'Athugasemdin þín fylgir umsókninni. Fjársýslan fer yfir hana og upplýsingarnar áður en hægt er að gefa út vottorð. Ef hægt er að gefa út vottorð verður það sent beint í stafræna pósthólfið þitt.\n\nÞú þarft ekki að sækja um aftur eða samþykkja umsóknina á ný.',
    description:
      'Text when the request with a comment was accepted (202, Markdown)',
  },
  yourCommentTitle: {
    id: 'fjs.ec.application:conclusion.yourCommentTitle',
    defaultMessage: 'Athugasemd þín',
    description: 'Title of the box that shows the comment the applicant sent',
  },
  reviewActionMessage: {
    id: 'fjs.ec.application:conclusion.reviewActionMessage',
    defaultMessage:
      'Umsóknin bíður yfirferðar hjá Fjársýslunni. Þú þarft ekki að gera neitt frekar að svo stöddu.',
    description:
      'Text next to the My pages button while the comment is reviewed',
  },
  closedTitle: {
    id: 'fjs.ec.application:conclusion.closedTitle',
    defaultMessage: 'Yfirferð lokið – ekki hægt að gefa út vottorð',
    description: 'Title when the case was closed without a certificate',
  },
  closedMessage: {
    id: 'fjs.ec.application:conclusion.closedMessage',
    defaultMessage:
      'Fjársýslan hefur lokið yfirferð umsóknarinnar en ekki er hægt að gefa út starfsvottorð á grundvelli fyrirliggjandi upplýsinga. Málinu hefur verið lokað.\n\nEf þú hefur spurningar geturðu haft samband við [starfsvottord@fjs.is](mailto:starfsvottord@fjs.is).',
    description:
      'Text when the case was closed without a certificate (Markdown; Fjársýsla ríkisins must confirm the contact details)',
  },
  closedWhatNextHeader: {
    id: 'fjs.ec.application:conclusion.closedWhatNextHeader',
    defaultMessage: 'Hvað get ég gert?',
    description: 'Header of the expandable box when the case was closed',
  },
  closedWhatNextIntro: {
    id: 'fjs.ec.application:conclusion.closedWhatNextIntro',
    defaultMessage:
      'Fjársýslan hefur lokið yfirferð og sent þér upplýsingar um niðurstöðuna.',
    description: 'Intro of the expandable box when the case was closed',
  },
  closedWhatNextDescription: {
    id: 'fjs.ec.application:conclusion.closedWhatNextDescription',
    defaultMessage:
      'Ef þú telur að upplýsingar um starfsferil þinn séu rangar geturðu sent tölvupóst á [starfsvottord@fjs.is](mailto:starfsvottord@fjs.is).',
    description:
      'Content of the expandable box when the case was closed (Markdown). Placeholder until the design gives the text.',
  },
  closedActionMessage: {
    id: 'fjs.ec.application:conclusion.closedActionMessage',
    defaultMessage:
      'Ef þú hefur spurningar um niðurstöðuna geturðu haft samband við Fjársýsluna.',
    description: 'Text next to the contact button when the case was closed',
  },
  contactButton: {
    id: 'fjs.ec.application:conclusion.contactButton',
    defaultMessage: 'Hafa samband',
    description: 'Button that writes an email to Fjársýsla ríkisins',
  },
  failedTitle: {
    id: 'fjs.ec.application:conclusion.failedTitle',
    defaultMessage: 'Ekki tókst að senda umsóknina',
    description: 'Title when the request could not be sent',
  },
  failedMessage: {
    id: 'fjs.ec.application:conclusion.failedMessage',
    defaultMessage:
      'Villa kom upp og umsóknin þín barst ekki. Valið þitt hefur verið varðveitt. Reyndu aftur.',
    description: 'Text when the request could not be sent',
  },
  failedWhatNextHeader: {
    id: 'fjs.ec.application:conclusion.failedWhatNextHeader',
    defaultMessage: 'Hvernig held ég áfram?',
    description: 'Header of the expandable box when sending failed',
  },
  failedWhatNextIntro: {
    id: 'fjs.ec.application:conclusion.failedWhatNextIntro',
    defaultMessage:
      'Umsóknin hefur ekki verið móttekin. Þú getur reynt sendinguna aftur.',
    description: 'Intro of the expandable box when sending failed',
  },
  failedWhatNextDescription: {
    id: 'fjs.ec.application:conclusion.failedWhatNextDescription',
    defaultMessage:
      'Reyndu að senda umsóknina aftur. Ef villan kemur upp aftur geturðu reynt síðar.',
    description: 'Content of the expandable box when sending failed (Markdown)',
  },
  previewChangedTitle: {
    id: 'fjs.ec.application:conclusion.previewChangedTitle',
    defaultMessage: 'Starfsferillinn hefur breyst',
    description:
      'Title when sending failed because the history changed (409 preview_changed)',
  },
  previewChangedMessage: {
    id: 'fjs.ec.application:conclusion.previewChangedMessage',
    defaultMessage:
      'Upplýsingar um starfsferilinn þinn breyttust eftir að þú skoðaðir þær. Farðu yfir starfsferilinn aftur og sendu umsóknina.',
    description:
      'Text when sending failed because the history changed (409 preview_changed)',
  },
  retryButton: {
    id: 'fjs.ec.application:conclusion.retryButton',
    defaultMessage: 'Reyna aftur',
    description: 'Button that sends the application again',
  },
  backToHistoryButton: {
    id: 'fjs.ec.application:conclusion.backToHistoryButton',
    defaultMessage: 'Skoða starfsferil',
    description: 'Button that goes back to the employment history',
  },
})

export const history = defineMessages({
  resubmitted: {
    id: 'fjs.ec.application:history.resubmitted',
    defaultMessage: 'Umsókn send aftur',
    description:
      'History log entry when the applicant sent the application again',
  },
  backToHistory: {
    id: 'fjs.ec.application:history.backToHistory',
    defaultMessage: 'Farið aftur yfir starfsferil',
    description:
      'History log entry when the applicant went back to the history after a failed attempt',
  },
})

export const pendingAction = defineMessages({
  processingTitle: {
    id: 'fjs.ec.application:pendingAction.processingTitle',
    defaultMessage: 'Umsókn móttekin',
    description: 'Overview card: Fjársýsla ríkisins received the request',
  },
  processingContent: {
    id: 'fjs.ec.application:pendingAction.processingContent',
    defaultMessage:
      'Starfsvottorðið verður sent í stafræna pósthólfið þitt þegar það er tilbúið.',
    description: 'Overview card: Fjársýsla ríkisins received the request',
  },
  closedTitle: {
    id: 'fjs.ec.application:pendingAction.closedTitle',
    defaultMessage: 'Ekki hægt að gefa út vottorð',
    description: 'Overview card: the case was closed without a certificate',
  },
  closedContent: {
    id: 'fjs.ec.application:pendingAction.closedContent',
    defaultMessage: 'Fjársýslan hefur lokið yfirferð umsóknarinnar.',
    description: 'Overview card: the case was closed without a certificate',
  },
})

export const errors = defineMessages({
  noHistoryTitle: {
    id: 'fjs.ec.application:errors.noHistoryTitle',
    defaultMessage: 'Engar upplýsingar fundust',
    description: 'Title when the applicant has no employment history',
  },
  noHistorySummary: {
    id: 'fjs.ec.application:errors.noHistorySummary',
    defaultMessage:
      'Ekki fundust upplýsingar um störf þín hjá ríkinu í gögnum Fjársýslunnar. Því er ekki hægt að halda áfram með umsóknina.\n\nEf þú telur að þú eigir að hafa skráðan starfsferil skaltu senda tölvupóst á [starfsvottord@fjs.is](mailto:starfsvottord@fjs.is).',
    description:
      'Text when the applicant has no employment history (Markdown; Fjársýsla ríkisins must confirm the contact details)',
  },
  unavailableTitle: {
    id: 'fjs.ec.application:errors.unavailableTitle',
    defaultMessage: 'Ekki tókst að sækja starfsferil',
    description: 'Title when Fjársýsla ríkisins’ service is unavailable',
  },
  unavailableSummary: {
    id: 'fjs.ec.application:errors.unavailableSummary',
    defaultMessage:
      'Ekki tókst að sækja upplýsingar um starfsferil frá Fjársýslu ríkisins. Reyndu aftur síðar. Ef villan kemur upp aftur, sendu tölvupóst á [starfsvottord@fjs.is](mailto:starfsvottord@fjs.is).',
    description:
      'Text when Fjársýsla ríkisins’ service is unavailable (Markdown)',
  },
  submitFailedTitle: {
    id: 'fjs.ec.application:errors.submitFailedTitle',
    defaultMessage: 'Ekki tókst að senda umsóknina',
    description: 'Title when sending the application failed',
  },
  submitFailedSummary: {
    id: 'fjs.ec.application:errors.submitFailedSummary',
    defaultMessage: 'Villa kom upp og umsóknin þín barst ekki. Reyndu aftur.',
    description: 'Text when sending the application failed',
  },
  previewChangedTitle: {
    id: 'fjs.ec.application:errors.previewChangedTitle',
    defaultMessage: 'Starfsferillinn hefur breyst',
    description: 'Title when the history changed before sending (409)',
  },
  previewChangedSummary: {
    id: 'fjs.ec.application:errors.previewChangedSummary',
    defaultMessage: 'Farðu yfir starfsferilinn aftur og sendu umsóknina.',
    description: 'Text when the history changed before sending (409)',
  },
})
