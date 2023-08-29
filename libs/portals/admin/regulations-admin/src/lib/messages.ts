import { defineMessages, MessageDescriptor } from 'react-intl'
import { DraftingStatus } from '@island.is/regulations/admin'

export const m = defineMessages({
  regulationAdmin: {
    id: 'admin-portal.regulations-admin:regulations-admin',
    defaultMessage: 'Reglugerðir',
  },
  regulationAdminEdit: {
    id: 'admin-portal.regulations-admin:regulations-edit',
    defaultMessage: 'Skráning',
  },
  regulationAdminMinistries: {
    id: 'admin-portal.regulations-admin:regulations-ministries',
    defaultMessage: 'Ráðuneyti',
  },
  regulationAdminDescription: {
    id: 'admin-portal.regulations-admin:regulation-admin-description',
    defaultMessage: 'Vinnslusvæði reglugerða',
  },
})

export const editorMsgs = defineMessages({
  stepContentHeadline: {
    id: 'ap.regulations-admin:draft-step_content-headline',
    defaultMessage: 'Texti reglugerðarinnar',
  },
  stepMetaHeadline: {
    id: 'ap.regulations-admin:draft-step_meta2-headline',
    defaultMessage: 'Skráning lýsigagna',
  },
  stepSignatureHeadline: {
    id: 'ap.regulations-admin:draft-step_signature-headline',
    defaultMessage: 'Undirritun',
  },
  stepSignatureIntro: {
    id: 'ap.regulations-admin:draft-step_signature-intro',
    defaultMessage:
      'Hér skal hlaða upp eintaki af reglugerðinni með undirritun. Það skjal verður að lokum framsent til Stjórnartíðinda.',
  },
  stepImpactHeadline: {
    id: 'ap.regulations-admin:draft-step_impacts-headline',
    defaultMessage: 'Áhrif á aðrar reglugerðir',
  },
  stepImpactIntro: {
    id: 'ap.regulations-admin:draft-step_impacts-intro',
    defaultMessage:
      'Hér er skráð hvaða reglugerðir falla brott og hvaða stofnreglugerðir taka efnislegum breytingum og texti þeirra uppfærður.',
  },
  stepReviewHeadline: {
    id: 'ap.regulations-admin:draft-step_review-headline',
    defaultMessage: 'Staðfesting fyrir útgáfu',
  },
  stepReviewIntro: {
    id: 'ap.regulations-admin:draft-step_review-intro',
    defaultMessage:
      'Áður en reglugerð er gefin út í Stjórnartíðindum, og birt í reglugerðasafninu á vefnum, þarf að yfirfara að allar skráðar upplýsingar séu réttar',
  },

  stepPublishHeadline: {
    id: 'ap.regulations-admin:draft-step_publish-headline',
    defaultMessage: 'Gefa út reglugerð',
  },
  stepPublishIntro: {
    id: 'ap.regulations-admin:draft-step_publish-intro',
    defaultMessage:
      'Eftir útgáfu í Stjórnartíðindum fær reglugerð nafn og getur verið birt í reglugerðasafninu á vefnum',
  },

  name: {
    id: 'ap.regulations-admin:draft-labels-name',
    defaultMessage: 'Útgáfunúmer í Stjórnartíðindum',
  },

  title: {
    id: 'ap.regulations-admin:draft-labels-title',
    defaultMessage: 'Titill reglugerðar',
  },

  text: {
    id: 'ap.regulations-admin:draft-labels-text',
    defaultMessage: 'Texti reglugerðar',
  },

  appendixes: {
    id: 'ap.regulations-admin:draft-appendixes-legend',
    defaultMessage: 'Viðaukar',
  },
  appendix_legend: {
    id: 'ap.regulations-admin:draft-appendix-legend',
    defaultMessage: 'Viðauki {idx}',
  },
  appendix_legend_revoked: {
    id: 'ap.regulations-admin:draft-appendix-legend-revoked',
    defaultMessage: 'Fjarlægður viðauki',
  },
  appendix_revoked_message: {
    id: 'ap.regulations-admin:draft-appendix-revoked-message',
    defaultMessage: 'Eldri viðauki felldur burt.',
  },
  appendix_revoked_undo: {
    id: 'ap.regulations-admin:draft-appendix-revoked-undo',
    defaultMessage: 'Afturkalla',
  },
  appendix_title: {
    id: 'ap.regulations-admin:draft-labels-appendix-title',
    defaultMessage: 'Heiti viðauka',
  },
  appendix_text: {
    id: 'ap.regulations-admin:draft-labels-appendix-title',
    defaultMessage: 'Texti viðauka',
  },
  appendix_open: {
    id: 'ap.regulations-admin:draft-btn-appendix-open',
    defaultMessage: 'Sýna',
  },
  appendix_close: {
    id: 'ap.regulations-admin:draft-btn-appendix-close',
    defaultMessage: 'Loka',
  },
  appendix_add: {
    id: 'ap.regulations-admin:draft-btn-appendix-add',
    defaultMessage: 'Bæta við viðauka',
  },
  appendix_remove: {
    id: 'ap.regulations-admin:draft-btn-appendix-remove',
    defaultMessage: 'Eyða viðauka {idx}',
  },
  appendix_remove_short: {
    id: 'ap.regulations-admin:draft-btn-appendix-remove-short',
    defaultMessage: 'Eyða',
  },
  appendix_remove_confirm: {
    id: 'ap.regulations-admin:draft-appendix-remove-confirm',
    defaultMessage: 'Eyða endanlega viðauka {idx}?',
  },
  appendix_shiftup: {
    id: 'ap.regulations-admin:draft-btn-appendix-shiftup',
    defaultMessage: 'Færa viðauka {idx} framar í röðinni',
  },
  appendix_shiftdown: {
    id: 'ap.regulations-admin:draft-btn-appendix-shiftdown',
    defaultMessage: 'Færa viðauka {idx} neðar í röðinni',
  },
  appendix_shiftup_short: {
    id: 'ap.regulations-admin:draft-btn-appendix-shiftup-short',
    defaultMessage: 'Færa upp',
  },
  appendix_shiftdown_short: {
    id: 'ap.regulations-admin:draft-btn-appendix-shiftdown-short',
    defaultMessage: 'Færa niður',
  },

  comments: {
    id: 'ap.regulations-admin:draft-labels-comments',
    defaultMessage: 'Athugasemdir ritstjóra',
  },
  comments_add: {
    id: 'ap.regulations-admin:draft-labels-comments-add',
    defaultMessage: 'Skrá athugasemdir ritstjóra',
  },

  author_legened: {
    id: 'ap.regulations-admin:draft-legend-author',
    defaultMessage: 'Höfundur/tengiliður',
  },
  author_legened__plural: {
    id: 'ap.regulations-admin:draft-legend-author--plural',
    defaultMessage: 'Höfundar/tengiliðir',
  },
  author: {
    id: 'ap.regulations-admin:draft-legend-author',
    defaultMessage: 'Kennitala / netfang',
  },
  author_add: {
    id: 'ap.regulations-admin:draft-btn-author-add',
    defaultMessage: 'Nýr tengiliður',
  },
  author_remove: {
    id: 'ap.regulations-admin:draft-btn-author-remove',
    defaultMessage: 'Eyða tengilið',
  },

  draftingNotes: {
    id: 'ap.regulations-admin:draft-labels-draftingnotes',
    defaultMessage: 'Minnispunktar / Skilaboð',
  },
  draftingNotes_descr: {
    id: 'ap.regulations-admin:draft-description-draftingnotes',
    defaultMessage:
      '(Ekki partur af reglugerðinni, aðeins til hliðsjónar í útgáfuferlinu.)',
  },

  idealPublishDate: {
    id: 'ap.regulations-admin:draft-labels-idealpublishdate',
    defaultMessage: 'Ósk um útgáfudag',
  },
  publishDate: {
    id: 'ap.regulations-admin:draft-labels-publishdate',
    defaultMessage: 'Skráðu útgáfudagsetningu',
  },

  idealPublishDate_default: {
    id: 'ap.regulations-admin:draft-opts-idealpublishdate-default',
    defaultMessage: 'Við fyrsta tækifæri',
  },
  idealPublishDate_fastTrack: {
    id: 'ap.regulations-admin:draft-otps-idealpublishdate-fasttrack',
    defaultMessage: '(hraðbirting)',
  },
  applyForFastTrack: {
    id: 'ap.regulations-admin:apply-for-fasttrack',
    defaultMessage: 'Þarf flýtimeðferð',
  },

  ministry: {
    id: 'ap.regulations-admin:draft-labels-ministry',
    defaultMessage: 'Ráðuneyti',
  },
  ministryPlaceholder: {
    id: 'ap.regulations-admin:draft-placeholder-ministry',
    defaultMessage: 'Lesið úr undirritun reglugerðar',
  },

  lawChapters: {
    id: 'ap.regulations-admin:draft-labels-lawchapter',
    defaultMessage: 'Kaflar í lagasafni',
  },
  lawChapterPlaceholder: {
    id: 'ap.regulations-admin:draft-labels-choose-ministry',
    defaultMessage: 'Veldu kafla',
  },
  lawChapter_add: {
    id: 'ap.regulations-admin:draft-btn-lawchapter-add',
    defaultMessage: 'Bæta við kafla',
  },
  lawChapter_remove: {
    id: 'ap.regulations-admin:draft-btn-lawchapter-remove',
    defaultMessage: 'Fjarlægja kafla',
  },

  signatureDate: {
    id: 'ap.regulations-admin:draft-labels-signaturedate',
    defaultMessage: 'Undirritunardagur',
  },
  signatureDatePlaceholder: {
    id: 'ap.regulations-admin:draft-placeholder-signaturedate',
    defaultMessage: 'Lesin úr undirritun reglugerðar',
  },

  signatureText: {
    id: 'ap.regulations-admin:draft-labels-signaturetext',
    defaultMessage: 'Texti undirritunarkafla',
  },

  signedDocumentDownloadFresh: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-download',
    defaultMessage: 'Sækja PDF til undirritunar',
  },
  signedDocumentDownloadFreshError: {
    id: 'ap.regulations-admin:error-downloaddraft',
    defaultMessage: 'Ekki var hægt að sækja PDF skrá',
  },
  signedDocumentUpload: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-upload',
    defaultMessage: 'Hlaða upp undirrituðu eintaki',
  },
  signedDocumentUploadDragPrompt: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-dragprompt',
    defaultMessage: 'Dragðu undirritað PDF skjal hingað …',
  },
  signedDocumentUploadDescr: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-description',
    defaultMessage: 'Leyfileg skráarsnið: PDF',
  },
  signedDocumentClear: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-clear',
    defaultMessage: 'Eyða skjali',
  },
  signedDocumentClearLong: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-clearlong',
    defaultMessage: 'Eyða undirrituðu skjali',
  },
  signedDocumentClearUndo: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-clear-undo',
    defaultMessage: 'Afturkalla eyðingu.',
  },
  signedDocumentLink: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-view',
    defaultMessage: 'Skoða skjal',
  },
  signedDocumentLinkLong: {
    id: 'ap.regulations-admin:draft-labels-signeddocument-viewlong',
    defaultMessage: 'Sækja undirritað skjal',
  },

  effectiveDate: {
    id: 'ap.regulations-admin:draft-labels-effectivedate',
    defaultMessage: 'Gildistökudagur',
  },
  effectiveDate_default: {
    id: 'ap.regulations-admin:draft-opts-effectivedate-default',
    defaultMessage: 'Tekur þegar gildi', // 'Á útgáfudegi'
  },

  type: {
    id: 'ap.regulations-admin:draft-labels-type',
    defaultMessage: 'Tegund reglugerðar',
  },
  typePlaceholder: {
    id: 'ap.regulations-admin:draft-labels-type',
    defaultMessage: 'Stýrist af titli reglugerðarinnar',
  },
  type_base: {
    id: 'ap.regulations-admin:draft-opts-type-base',
    defaultMessage: 'Stofnreglugerð',
  },
  type_amending: {
    id: 'ap.regulations-admin:draft-opts-type-amending',
    defaultMessage: 'Breytingareglugerð',
  },
  type_repealing: {
    id: 'ap.regulations-admin:draft-opts-type-amending',
    defaultMessage: 'Brottfellingarreglugerð',
  },

  cancellation_add: {
    id: 'ap.regulations-admin:draft-btn-cancellation-add',
    defaultMessage: 'Ný brottfelling',
  },
  change_add: {
    id: 'ap.regulations-admin:draft-btn-change-add',
    defaultMessage: 'Ný texta-/ákvæðabreyting',
  },

  publish_button: {
    id: 'ap.regulations-admin:draft-btn-publish',
    defaultMessage: 'Gefa út reglugerð',
  },
  deleteConfirmation: {
    id: 'ap.regulations-admin:draft-label-deleteConfirmation',
    defaultMessage: 'Ertu alveg viss um að þú viljir eyða ',
  },
})

export const impactMsgs = defineMessages({
  impactListTitle: {
    id: 'ap.regulations-admin:impacts-list-title',
    defaultMessage: 'Skráðar áhrifafærslur',
  },
  impactListTitleEmpty: {
    id: 'ap.regulations-admin:impacts-list-title',
    defaultMessage: 'Engar áhrifafærslur skráðar',
  },
  typeChange: {
    id: 'ap.regulations-admin:impacts-type-change',
    defaultMessage: 'Textabreyting',
  },
  typeCancellation: {
    id: 'ap.regulations-admin:impacts-type-cancellation',
    defaultMessage: 'Brottfelling',
  },

  impactListEditButton: {
    id: 'ap.regulations-admin:impacts-list-editbutton',
    defaultMessage: 'Skoða / breyta',
  },

  impactListViewButton: {
    id: 'ap.regulations-admin:impacts-list-editbutton',
    defaultMessage: 'Skoða',
  },

  impactListDeleteButton: {
    id: 'ap.regulations-admin:impacts-list-deletebutton',
    defaultMessage: 'Eyða',
  },

  selfAffecting: {
    id: 'ap.regulations-admin:draft-label-impact-selfaffecting',
    defaultMessage: 'Hefur áhrif á sjálfa sig',
  },

  deleteConfirmation: {
    id: 'ap.regulations-admin:draft-label-impact-deleteConfirmation',
    defaultMessage: 'Ertu viss um að þú viljir eyða þessari skráningu?',
  },

  // ---------------------------------------------------------------------------

  regExplainer: {
    id: 'ap.regulations-admin:draft-impactedreg-explainer',
    defaultMessage:
      'ATH: Einungis er hægt að breyta reglugerðum sem minnst er á með skýrum hætti í texta reglugerðarinnar.',
  },
  regExplainer_editLink: {
    id: 'ap.regulations-admin:draft-impactedreg-editlink',
    defaultMessage: 'Endurskoða textann',
  },

  regSelect: {
    id: 'ap.regulations-admin:draft-label-impactedreg',
    defaultMessage: 'Reglugerð sem breytist',
  },
  regSelect_mentionedNotFound: {
    id: 'ap.regulations-admin:draft-opts-mentionednotfound',
    defaultMessage: 'er ekki reglugerð',
  },
  regSelect_mentionedRepealed: {
    id: 'ap.regulations-admin:draft-opts-mentionedrepealed',
    defaultMessage: 'brottfallin',
  },
  regSelect_baseNotFound: {
    id: 'ap.regulations-admin:draft-opts-mentionednotfound',
    defaultMessage: 'Stofnreglugerð fannst ekki við leit að ',
  },
  regSelect_placeholder: {
    id: 'ap.regulations-admin:draft-opts-impactedreg_placeholder',
    defaultMessage: 'Veldu reglugerð',
  },
  regSelectAmmending_placeholder: {
    id: 'ap.regulations-admin:draft-opts-impactedreg_ammending_placeholder',
    defaultMessage: 'Sláðu inn númer stofnreglugerðar (Dæmi: 438/2022)',
  },
  effectiveDate: {
    id: 'ap.regulations-admin:draft-labels-impacteffectivedate',
    defaultMessage: 'Gildistaka breytinga',
  },
  effectiveDate_default: {
    id: 'ap.regulations-admin:draft-opts-impacteffectivedate-default',
    defaultMessage: 'Tekur þegar gildi', // 'Á útgáfudegi'
  },
  effectiveDate_toosoon: {
    id: 'ap.regulations-admin:draft-opts-impacteffectivedate-toosoon',
    defaultMessage: 'Breytingar geta ekki tekið gildi á undan reglugerðinni', // 'Á útgáfudegi'
  },

  chooseType: {
    id: 'ap.regulations-admin:draft-legend-impacttype',
    defaultMessage: 'Hvað viltu gera við reglugerðina?',
  },
  chooseType_cancel: {
    id: 'ap.regulations-admin:draft-legend-impacttype-cancel',
    defaultMessage: 'Fella hana brott',
  },
  chooseType_change: {
    id: 'ap.regulations-admin:draft-legend-impacttype-change',
    defaultMessage: 'Gera textabreytingar',
  },
  chooseType_or: {
    id: 'ap.regulations-admin:draft-legend-impacttype-or',
    defaultMessage: 'eða',
  },

  saveButtonCancallation: {
    id: 'ap.regulations-admin:draft-btn-cancallation-save',
    defaultMessage: 'Vista brottfellingu',
  },
  saveButtonChange: {
    id: 'ap.regulations-admin:draft-btn-change-save',
    defaultMessage: 'Vista brottfellingu',
  },
  cancelButton: {
    id: 'ap.regulations-admin:draft-btn-impact-cancel',
    defaultMessage: 'Hætta við',
  },
  deleteButton: {
    id: 'ap.regulations-admin:draft-btn-impact-remove',
    defaultMessage: 'Eyða áhrifafærslu',
  },

  cancelledRegulation: {
    id: 'ap.regulations-admin:draft-label-cancelledregulation',
    defaultMessage: 'Reglugerð sem fellur brott',
  },
  changedRegulation: {
    id: 'ap.regulations-admin:draft-label-changedregulation',
    defaultMessage: 'Stofnreglugerð sem breytist',
  },

  changedTitle: {
    id: 'ap.regulations-admin:draft-label-changedtitle',
    defaultMessage: 'Nýr titill reglugerðar',
  },
  changedText: {
    id: 'ap.regulations-admin:draft-legend-changedtitle',
    defaultMessage: 'Uppfærður texti reglugerðar',
  },
})

export const errorMsgs = defineMessages({
  typeRequired: {
    id: 'ap.regulations-admin:error-typefield-required',
    defaultMessage: 'Ekki hægt að greina tegund reglugerðar út frá titli',
  },
  signedDocumentUrlRequired: {
    id: 'ap.regulations-admin:error-signeddocurl-required',
    defaultMessage: 'Það verður að hlaða upp undirrituðu eintaki',
  },
  fieldRequired: {
    id: 'ap.regulations-admin:error-field-required',
    defaultMessage: 'Þessi reitur má ekki vera tómur',
  },
  amendingTitleBaseType: {
    id: 'ap.regulations-admin:error-amending-title-base-type',
    defaultMessage:
      'Breytingareglugerðartitill ekki leyfilegur á stofnreglugerð',
  },
  baseTitleAmendingType: {
    id: 'ap.regulations-admin:error-base-title-amending-type',
    defaultMessage: 'Breytingareglugerð þarf að nefna breytingarnar í titli',
  },
  htmlWarnings: {
    id: 'ap.regulations-admin:error-html-warnings',
    defaultMessage: 'Villur í uppsetningu/innihaldi texta',
  },
  ministryUnknown: {
    id: 'ap.regulations-admin:error-ministry-unknown',
    defaultMessage: 'Nafn ráðuneytis er óþekkt',
  },
  impactMissing: {
    id: 'ap.regulations-admin:error-impactmissing',
    defaultMessage:
      'Breytingareglugerð verður í það minnsta að fella eina reglugerð úr gildi eða breyta ákvæðum hennar.',
  },
  impactingUnMentioned: {
    id: 'ap.regulations-admin:error-impact-unmentioned',
    defaultMessage:
      'Hvergi er minnst á þessa reglugerð í texta nýju reglugerðarinnar.',
  },
  titleTooLong: {
    id: 'ap.regulations-admin:title-is-too-long',
    defaultMessage: 'Titill reglugerðar er of langur.',
  },
})

export const homeMessages = defineMessages({
  title: {
    id: 'ap.regulations-admin:home-title',
    defaultMessage: 'Vinnslusvæði reglugerða',
  },
  intro: {
    id: 'ap.regulations-admin:home-intro',
    defaultMessage:
      'Nýskráning fyrir lögformlega útgáfu í Stjórnartíðindum og endurbirtingu í reglugerðasafni.',
  },

  taskListTitle: {
    id: 'ap.regulations-admin:tasklist-title',
    defaultMessage: 'Reglugerðir í vinnslu',
  },
  shippedTitle: {
    id: 'ap.regulations-admin:shipped-title',
    defaultMessage: 'Reglugerðir sem bíða birtingar',
  },
  createRegulation: {
    id: 'ap.regulations-admin:create-regulation-cta',
    defaultMessage: 'Skrá reglugerð',
  },
  taskList_draftTitleMissing: {
    id: 'ap.regulations-admin:tasklist-draft-title-missing',
    defaultMessage: '—  ónefnd drög  —',
  },

  cta: {
    id: 'ap.regulations-admin:task-cta',
    defaultMessage: 'Halda áfram',
  },

  cta_seeRegulation: {
    id: 'ap.regulations-admin:task-cta-see-regulation',
    defaultMessage: 'Skoða reglugerð',
  },

  cta_publish: {
    id: 'ap.regulations-admin:task-cta-publish',
    defaultMessage: 'Skrá útgáfu',
  },

  publishSoon: editorMsgs.idealPublishDate_default,
  publishFastTrack: editorMsgs.idealPublishDate_fastTrack,
  publishToday: {
    id: 'ap.regulations-admin:idealpublishdate-today',
    defaultMessage: 'Í dag',
  },
  noDataTitle: {
    id: 'ap.regulations-admin:no-data-title',
    defaultMessage: 'Engar reglugerðir í vinnslu til birtingar',
  },
  noDataText: {
    id: 'ap.regulations-admin:no-data-text',
    defaultMessage:
      'Í augnablikinu eru engar reglugerðir í vinnslu hér. Veldu "Skrá reglugerð" hér að oftan til að byrja skráningu. Ef þú telur að um villu sé að ræða skal hafa samband við ritstjóra.',
  },
  errorTitle: {
    id: 'ap.regulations-admin:error-title',
    defaultMessage: 'Villa í þjónustu',
  },
  errorText: {
    id: 'ap.regulations-admin:error-text',
    defaultMessage:
      'Villa kom upp í þjónustu. Vinsamlegast hafið samband við ritstjóra.',
  },
})

export const ministryMessages = defineMessages({
  title: {
    id: 'ap.regulations-admin:ministry-title',
    defaultMessage: 'Skráning ráðuneyta',
  },
  intro: {
    id: 'ap.regulations-admin:ministry-intro',
    defaultMessage: 'Umsýsla og skráning ráðuneyta er góð skemmtun.',
  },
  cta: {
    id: 'ap.regulations-admin:ministry-cta',
    defaultMessage: 'Breyta',
  },
})

export const statusMsgs: Record<DraftingStatus, MessageDescriptor> =
  defineMessages({
    draft: {
      id: 'ap.regulations-admin:status-draft',
      defaultMessage: 'Drög',
    },
    proposal: {
      id: 'ap.regulations-admin:status-proposal',
      defaultMessage: 'Tilbúið í yfirlestur',
    },
    shipped: {
      id: 'ap.regulations-admin:status-shipped',
      defaultMessage: 'Bíður birtingar',
    },
    published: {
      id: 'ap.regulations-admin:status-published',
      defaultMessage: 'Birt',
    },
  })

export const buttonsMsgs = defineMessages({
  continue: {
    id: 'ap.regulations-admin:btn-continue',
    defaultMessage: 'Halda áfram',
  },
  goBack: {
    id: 'ap.regulations-admin:btn-back',
    defaultMessage: 'Til baka',
  },
  save: {
    id: 'ap.regulations-admin:btn-savestatus',
    defaultMessage: 'Vista stöðu',
  },
  saveAndClose: {
    id: 'ap.regulations-admin:btn-savestatus-and-close',
    defaultMessage: 'Vista og loka',
  },
  close: {
    id: 'ap.regulations-admin:btn-close',
    defaultMessage: 'Loka',
  },
  saveSuccess: {
    id: 'ap.regulations-admin:btn-savestatus-success',
    defaultMessage: 'Staða vistuð',
  },
  saveFailure: {
    id: 'ap.regulations-admin:btn-savestatus-failure',
    defaultMessage: 'Ekki tókst að vista',
  },
  propose: {
    id: 'ap.regulations-admin:btn-propose',
    defaultMessage: 'Senda í yfirlestur',
  },
  prepShipping: {
    id: 'ap.regulations-admin:btn-prepshipping',
    defaultMessage: 'Undirbúa útgáfuferli',
  },
  publish: {
    id: 'ap.regulations-admin:btn-publish',
    defaultMessage: 'Búið að senda til birtingar í stjórnartíðindum',
  },
  delete: {
    id: 'ap.regulations-admin:btn-delete',
    defaultMessage: 'Eyða færslu',
  },
  confirmDelete: {
    id: 'ap.regulations-admin:btn-delete-confirm',
    defaultMessage:
      'Þessu uppkasti að reglugerð verður eytt varanlega. Ertu viss um að þú viljir halda áfram?',
  },
  hasBeenDeleted: {
    id: 'ap.regulations-admin:delete-confirmed',
    defaultMessage: 'Þessu uppkasti hefur verið eytt.',
  },
})

export const reviewMessages = defineMessages({
  confirmBeforePublish: {
    id: 'ap.regulations-admin:review-confirmmessage',
    defaultMessage: 'Ég hef yfirfarið að reglugerðin sé rétt skráð',
  },
  warningsTitle: {
    id: 'ap.regulations-admin:review-warnings-title',
    defaultMessage: 'Eftirfarandi atriði þarf að laga:',
  },
  jumpToStepButton: {
    id: 'ap.regulations-admin:review-jump-to-fix',
    defaultMessage: 'Skoða',
  },
  downloadSignedDocument: {
    id: 'ap.regulations-admin:review-download-signeddocument',
    defaultMessage: 'Sækja undirritaða útgáfu',
  },
  downloadPDFVersion: {
    id: 'ap.regulations-admin:review-download-pdfversion',
    defaultMessage: 'Sækja PDF til birtingar',
  },
  copyTitle: {
    id: 'ap.regulations-admin:review-copy-title',
    defaultMessage: 'Afrita titil reglugerðarinnar',
  },
  copyHtml: {
    id: 'ap.regulations-admin:review-copy-html',
    defaultMessage: 'Afrita HTML reglugerðarinnar',
  },
  copySignatureDate: {
    id: 'ap.regulations-admin:review-copy-signaturedate',
    defaultMessage: 'Afrita undirritunardag',
  },
  copyIdealPublishDate: {
    id: 'ap.regulations-admin:review-copy-idealpublishdate',
    defaultMessage: 'Afrita óska útgáfudag',
  },

  impactsTitle: {
    id: 'ap.regulations-admin:review-impacts-title',
    defaultMessage: 'Áhrif á aðrar reglugerðir',
  },
})
