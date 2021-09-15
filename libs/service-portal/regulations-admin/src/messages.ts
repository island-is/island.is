import { defineMessages, MessageDescriptor } from 'react-intl'
import { DraftingStatus } from '@island.is/regulations/admin'

export const editorMsgs = defineMessages({
  step1Headline: {
    id: 'ap.regulations-admin:draft-step1-headline',
    defaultMessage: 'Kjarnaupplýsingar',
  },
  step2Headline: {
    id: 'ap.regulations-admin:draft-step2-headline',
    defaultMessage: 'Skráning lýsigagna',
  },
  step3Headline: {
    id: 'ap.regulations-admin:draft-step3-headline',
    defaultMessage: 'Breytingar / brottfellingar',
  },
  step4Headline: {
    id: 'ap.regulations-admin:draft-step4-headline',
    defaultMessage: 'Staðfesting fyrir útgáfu í Stjórnartíðindum',
  },
  step4Intro: {
    id: 'ap.regulations-admin:draft-step4-intro',
    defaultMessage:
      'Vinsamlega yfirfarið að allar skráðar upplýsingar séu réttar',
  },

  title: {
    id: 'ap.regulations-admin:draft-labels-title',
    defaultMessage: 'Titill reglugerðar',
  },

  text: {
    id: 'ap.regulations-admin:draft-labels-text',
    defaultMessage: 'Texti reglugerðar',
  },

  appendix_legend: {
    id: 'ap.regulations-admin:draft-appendix-legend',
    defaultMessage: 'Viðauki {idx}',
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
  appendix_shiftup_short: {
    id: 'ap.regulations-admin:draft-btn-appendix-shiftup-short',
    defaultMessage: 'Færa upp',
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
    defaultMessage: 'Minnispunktar / Ábendingar',
  },

  draftingNotes_hide: {
    id: 'ap.regulations-admin:draft-labels-draftingnotes-hide',
    defaultMessage: 'Fela minnispunkta',
  },

  idealPublishDate: {
    id: 'ap.regulations-admin:draft-labels-idealpublishdate',
    defaultMessage: 'Ósk um útgáfudag',
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
    defaultMessage: 'Sækja um flýtimeðferð',
  },

  ministry: {
    id: 'ap.regulations-admin:draft-labels-ministry',
    defaultMessage: 'Ráðuneyti',
  },
  ministryPlaceholder: {
    id: 'ap.regulations-admin:draft-labels-choose-ministry',
    defaultMessage: 'Veldu ráðuneyti',
  },

  lawChapter: {
    id: 'ap.regulations-admin:draft-labels-lawchapter',
    defaultMessage: 'Kaflar í lagasasfni',
  },
  lawChapterPlaceholder: {
    id: 'ap.regulations-admin:draft-labels-choose-ministry',
    defaultMessage: 'Veldu lagakafla',
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
  type_base: {
    id: 'ap.regulations-admin:draft-opts-type-base',
    defaultMessage: 'Stofnreglugerð',
  },
  type_affecting: {
    id: 'ap.regulations-admin:draft-opts-type-affecting',
    defaultMessage: 'Breytingareglugerð',
  },

  cancellation_add: {
    id: 'ap.regulations-admin:draft-btn-cancellation-add',
    defaultMessage: 'Ný brottfelling',
  },
  change_add: {
    id: 'ap.regulations-admin:draft-btn-change-add',
    defaultMessage: 'Ný texta-/ákvæðabreyting',
  },

  impactRegSelect: {
    id: 'ap.regulations-admin:draft-label-impactedreg',
    defaultMessage: 'Reglugerð sem breytist',
  },
  impactRegSelect_placeholder: {
    id: 'ap.regulations-admin:draft-opts-impactedreg_placeholder',
    defaultMessage: 'Veldu reglugerð',
  },

  chooseImpactType: {
    id: 'ap.regulations-admin:draft-legend-impacttype',
    defaultMessage: 'Hvað viltu gera við reglugerðina?',
  },
  chooseImpactType_cancel: {
    id: 'ap.regulations-admin:draft-legend-impacttype-cancel',
    defaultMessage: 'Fella hana brott',
  },
  chooseImpactType_change: {
    id: 'ap.regulations-admin:draft-legend-impacttype-change',
    defaultMessage: 'Gera textabreytingar',
  },
  chooseImpactType_or: {
    id: 'ap.regulations-admin:draft-legend-impacttype-or',
    defaultMessage: 'eða',
  },

  cancallation_save: {
    id: 'ap.regulations-admin:draft-btn-cancallation-save',
    defaultMessage: 'Vista brottfellingu',
  },
  change_save: {
    id: 'ap.regulations-admin:draft-btn-change-save',
    defaultMessage: 'Vista brottfellingu',
  },
  impact_cancel: {
    id: 'ap.regulations-admin:draft-btn-impact-cancel',
    defaultMessage: 'Hætta við',
  },
  impact_remove: {
    id: 'ap.regulations-admin:draft-btn-impact-remove',
    defaultMessage: 'Eyða áhrifafærslu',
  },
  change_edit: {
    id: 'ap.regulations-admin:draft-btn-change-edit',
    defaultMessage: 'Breyta breytingafærslu',
  },

  cancelledRegulation: {
    id: 'ap.regulations-admin:draft-label-cancelledregulation',
    defaultMessage: 'Reglugerð sem fellur brott',
  },
  changedRegulation: {
    id: 'ap.regulations-admin:draft-label-changedregulation',
    defaultMessage: 'Stofnreglugerð sem breytist',
  },
  impactDate: {
    id: 'ap.regulations-admin:draft-label-impactdate',
    defaultMessage: 'Gildistökudagur',
  },

  changedTitle: {
    id: 'ap.regulations-admin:draft-label-changedtitle',
    defaultMessage: 'Nýr titill reglugerðar',
  },
  changedText: {
    id: 'ap.regulations-admin:draft-legend-changedtitle',
    defaultMessage: 'Uppfærður texti reglugerðar',
  },
  requiredFieldError: {
    id: 'ap.regulations-admin:required-field-missing-error',
    defaultMessage: 'Þessi reitur má ekki vera tómur',
  },
})

export const warningMessages = defineMessages({
  impactMissing: {
    id: 'ap.regulations-admin:warning-impactmissing',
    defaultMessage:
      'Breytingareglugerð verður að fella einhverja reglugerð úr gildi eða breyta ákvæðum hennar.',
  },
})

export const homeMessages = defineMessages({
  title: {
    id: 'ap.regulations-admin:home-title',
    defaultMessage: 'Skráning reglugerða',
  },
  intro: {
    id: 'ap.regulations-admin:home-intro',
    defaultMessage: 'Nýskráning og ritstjórn reglugerða er góð skemmtun.',
  },

  taskListTitle: {
    id: 'ap.regulations-admin:tasklist-title',
    defaultMessage: 'Reglugerðir í vinnslu',
  },
  shippedTitle: {
    id: 'ap.regulations-admin:shipped-title',
    defaultMessage: 'Reglugerðir sem bíða formlegrar birtingar',
  },
  createRegulation: {
    id: 'ap.regulations-admin:create-regulation-cta',
    defaultMessage: 'Skrá nýja reglugerð',
  },

  cta: {
    id: 'ap.regulations-admin:task-cta',
    defaultMessage: 'Halda áfram',
  },

  publishSoon: editorMsgs.idealPublishDate_default,
  publishFastTrack: editorMsgs.idealPublishDate_fastTrack,
  publishToday: {
    id: 'ap.regulations-admin:idealpublishdate-today',
    defaultMessage: 'Í dag',
  },
})

export const ministryMessages = defineMessages({
  title: {
    id: 'ap.regulations-admin:ministry-title',
    defaultMessage: 'Skráning ráðuneyta',
  },
  intro: {
    id: 'ap.regulations-admin:ministry-intro',
    defaultMessage: 'Ritstjórn ráðuneyta er góð skemmtun.',
  },
  cta: {
    id: 'ap.regulations-admin:ministry-cta',
    defaultMessage: 'Breyta',
  },
})

export const statusMsgs: Record<
  DraftingStatus,
  MessageDescriptor
> = defineMessages({
  draft: {
    id: 'ap.regulations-admin:status-draft',
    defaultMessage: 'Uppkast í vinnslu',
  },
  proposal: {
    id: 'ap.regulations-admin:status-proposal',
    defaultMessage: 'Tilbúið í yfirlestur',
  },
  shipped: {
    id: 'ap.regulations-admin:status-shipped',
    defaultMessage: 'Bíður birtingar',
  },
})

export const buttonsMsgs = defineMessages({
  continue: {
    id: 'ap.regulations-admin:btn-continue',
    defaultMessage: 'Halda áfram', // Næsta skref
  },
  goBack: {
    id: 'ap.regulations-admin:btn-back',
    defaultMessage: 'Til baka',
  },
  save: {
    id: 'ap.regulations-admin:btn-savestatus',
    defaultMessage: 'Vista stöðu',
  },
  propose: {
    id: 'ap.regulations-admin:btn-propose',
    defaultMessage: 'Senda í yfirlestur',
  },
  prepShipping: {
    id: 'ap.regulations-admin:btn-prepshipping',
    defaultMessage: 'Hefja útgáfuferli',
  },
  publish: {
    id: 'ap.regulations-admin:btn-publish',
    defaultMessage: 'Senda til útgáfu í stjórnartíðindum',
  },
  delete: {
    id: 'ap.regulations-admin:btn-delete',
    defaultMessage: 'Eyða færslu',
  },
  confirmDelete: {
    id: 'ap.regulations-admin:btn-delete-confirm',
    defaultMessage: 'Þessu uppkasti að reglugerð verður eytt varanlega!',
  },
})
