import { Appendix, HTMLText } from '@island.is/regulations'
import {
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraft,
} from '@island.is/regulations/admin'
import { Step, StepNames } from '../types'
import {
  AppendixDraftForm,
  DateDraftField,
  DraftCancelForm,
  DraftChangeForm,
  DraftField,
  GroupedDraftImpactForms,
  HtmlDraftField,
  RegDraftForm,
  StepNav,
} from './types'
import { errorMsgs } from '../lib/messages'
import { MessageDescriptor } from 'react-intl'

const emptyHtml = '' as HTMLText

// ---------------------------------------------------------------------------

export const stepsBase: Record<Step, StepNav> = {
  basics: {
    name: StepNames.basics,
    next: StepNames.signature,
  },
  signature: {
    name: StepNames.signature,
    prev: StepNames.basics,
    next: StepNames.meta,
  },
  meta: {
    name: StepNames.meta,
    prev: StepNames.signature,
    next: StepNames.impacts,
  },
  impacts: {
    name: StepNames.impacts,
    prev: StepNames.meta,
    next: StepNames.review,
  },
  review: {
    name: StepNames.review,
    prev: StepNames.impacts,
  },
  publish: {
    name: StepNames.publish,
  },
}

export const stepsAmending: Record<Step, StepNav> = {
  impacts: {
    name: StepNames.impacts,
    next: StepNames.basics,
  },
  basics: {
    name: StepNames.basics,
    prev: StepNames.impacts,
    next: StepNames.signature,
  },
  signature: {
    name: StepNames.signature,
    prev: StepNames.basics,
    next: StepNames.meta,
  },
  meta: {
    name: StepNames.meta,
    prev: StepNames.signature,
    next: StepNames.review,
  },
  review: {
    name: StepNames.review,
    prev: StepNames.meta,
  },
  publish: {
    name: StepNames.publish,
  },
}

// ---------------------------------------------------------------------------

const f = <V, T extends string | undefined>(
  value: V,
  required?: true | MessageDescriptor,
  type?: T,
): DraftField<V, T extends string ? T : ''> => ({
  value,
  required,
  type: (type || '') as T extends string ? T : '',
})
export const fText = <T extends string>(
  value: T,
  required?: true | MessageDescriptor,
): DraftField<T, 'text'> => ({
  value,
  required,
  type: 'text',
})
export const fHtml = (
  value: HTMLText,
  required?: true | MessageDescriptor,
): HtmlDraftField => ({
  value,
  required,
  type: 'html',
  warnings: [],
})
export const fDate = (
  value: Date | undefined,
  required?: true | MessageDescriptor,
  opts: { min?: Date; max?: Date } = {},
): DateDraftField => ({
  value,
  required,
  type: 'date',
  max: opts.max,
  min: opts.min,
})

// ---------------------------------------------------------------------------

export const makeDraftCancellationForm = (
  cancellation: DraftRegulationCancel,
): DraftCancelForm => ({
  id: cancellation.id,
  type: 'repeal',
  name: cancellation.name,
  regTitle: cancellation.regTitle,
  date: fDate(cancellation.date && new Date(cancellation.date)),
})

export const makeDraftChangeForm = (
  change: DraftRegulationChange,
): DraftChangeForm => ({
  id: change.id,
  type: 'amend',
  name: change.name,
  regTitle: change.regTitle,
  date: fDate(change.date && new Date(change.date)),
  title: fText(change.title, true),
  text: fHtml(change.text, true),
  appendixes: change.appendixes.map((a, i) =>
    makeDraftAppendixForm(a, String(i)),
  ),
  comments: fHtml(change.comments),
  diff: fHtml(change.diff || emptyHtml),
})

// ---------------------------------------------------------------------------

export const makeDraftAppendixForm = (
  appendix: Appendix & { diff?: HTMLText },
  key: string,
): AppendixDraftForm => ({
  title: fText(appendix.title, true),
  text: fHtml(appendix.text, true),
  diff: appendix.diff ? fHtml(appendix.diff) : undefined,
  key,
})

// ===========================================================================

export const makeDraftForm = (draft: RegulationDraft): RegDraftForm => {
  const impacts = draft.impacts
  const impactForms: GroupedDraftImpactForms = {}
  Object.keys(impacts).forEach((impGrp, i) => {
    impactForms[impGrp] = impacts[impGrp].map((impact) => {
      return impact.type === 'amend'
        ? makeDraftChangeForm(impact)
        : makeDraftCancellationForm(impact)
    })
  })

  const form: RegDraftForm = {
    id: draft.id,
    title: fText(draft.title, true),
    text: fHtml(draft.text, true),
    appendixes: draft.appendixes.map((a, i) =>
      makeDraftAppendixForm(a, String(i)),
    ),

    idealPublishDate: fDate(
      draft.idealPublishDate && new Date(draft.idealPublishDate),
    ),
    fastTrack: f(draft.fastTrack || false),

    effectiveDate: fDate(draft.effectiveDate && new Date(draft.effectiveDate)),

    signatureText: fHtml(draft.signatureText, true),
    signedDocumentUrl: f(
      draft.signedDocumentUrl,
      errorMsgs.signedDocumentUrlRequired,
    ),

    lawChapters: f((draft.lawChapters || []).map((chapter) => chapter.slug)),

    mentioned: [], // NOTE: Contains values derived from `text`

    impacts: impactForms,

    draftingNotes: fHtml(draft.draftingNotes),
    draftingStatus: draft.draftingStatus,
    authors: f(draft.authors.map((author) => author.authorId)),

    type: f(draft.type, errorMsgs.typeRequired),
    ministry: f(undefined /* draft.ministry */, true), // NOTE: The ministry is always a derived value
    signatureDate: fDate(
      undefined /* draft.signatureDate && new Date(draft.signatureDate) */,
      true,
    ), // NOTE: Signature date is always a derived value

    name: f(draft.name),
  }

  return form
}
