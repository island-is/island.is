import { Appendix, HTMLText } from '@island.is/regulations'
import { RegulationDraft } from '@island.is/regulations/admin'
import { Step } from '../types'
import { DraftField, HtmlDraftField, RegDraftForm, StepNav } from './types'

// ---------------------------------------------------------------------------

export const steps: Record<Step, StepNav> = {
  basics: {
    name: 'basics',
    next: 'meta',
  },
  meta: {
    name: 'meta',
    prev: 'basics',
    next: 'signature',
  },
  signature: {
    name: 'signature',
    prev: 'meta',
    next: 'impacts',
  },
  impacts: {
    name: 'impacts',
    prev: 'signature',
    next: 'review',
  },
  review: {
    name: 'review',
    prev: 'impacts',
  },
}

// ---------------------------------------------------------------------------

const f = <V, T extends string | undefined>(
  value: V,
  required?: true,
  type?: T,
): DraftField<V, T extends string ? T : ''> => ({
  value,
  required,
  type: (type || '') as T extends string ? T : '',
})
const fText = <T extends string>(
  value: T,
  required?: true,
): DraftField<T, 'text'> => ({
  value,
  required,
  type: 'text',
})
const fHtml = (value: HTMLText, required?: true): HtmlDraftField => ({
  value,
  required,
  type: 'html',
  warnings: [],
})

export const makeDraftAppendixForm = (appendix: Appendix, key: string) => ({
  title: fText(appendix.title, true),
  text: fHtml(appendix.text, true),
  key,
})

export const makeDraftForm = (draft: RegulationDraft): RegDraftForm => {
  const form: RegDraftForm = {
    id: draft.id,
    title: fText(draft.title, true),
    text: fHtml(draft.text, true),
    appendixes: draft.appendixes.map((a, i) =>
      makeDraftAppendixForm(a, String(i)),
    ),
    comments: fHtml(draft.comments),

    idealPublishDate: f(
      draft.idealPublishDate && new Date(draft.idealPublishDate),
    ),
    fastTrack: f(draft.fastTrack || false),

    effectiveDate: f(draft.effectiveDate && new Date(draft.effectiveDate)),

    signatureText: fHtml(draft.signatureText, true),
    signedDocumentUrl: f(draft.signedDocumentUrl, true),

    lawChapters: f((draft.lawChapters || []).map((chapter) => chapter.slug)),

    mentioned: [], // NOTE: Contains values derived from `text`

    impacts: draft.impacts.map((impact) => {
      return impact.type === 'amend'
        ? {
            type: impact.type,
            id: impact.id,
            name: impact.name,
            regTitle: impact.regTitle,
            date: f(new Date(impact.date), true),
            title: fText(impact.title, true),
            text: fHtml(impact.text, true),
            appendixes: impact.appendixes.map((a, i) =>
              makeDraftAppendixForm(a, String(i)),
            ),
            comments: fHtml(impact.comments),
          }
        : {
            type: impact.type,
            id: impact.id,
            name: impact.name,
            regTitle: impact.regTitle,
            date: f(new Date(impact.date), true),
          }
    }),

    draftingNotes: fHtml(draft.draftingNotes),
    draftingStatus: draft.draftingStatus,
    authors: f(draft.authors.map((author) => author.authorId)),

    type: f(undefined /* draft.type */, true), // NOTE: Regulation type is always a derived value
    ministry: f(undefined /* draft.ministry */, true), // NOTE: The ministry is always a derived value
    signatureDate: f(
      undefined /* draft.signatureDate && new Date(draft.signatureDate) */,
      true,
    ), // NOTE: Signature date is always a derived value
  }

  return form
}
