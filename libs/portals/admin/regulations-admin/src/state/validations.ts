import { HTMLText, PlainText } from '@island.is/regulations'
import { makeHighAngstWarnings } from '@dmr.is/regulations-tools/useTextWarnings'
import { errorMsgs } from '../lib/messages'
import { RegulationDraftTypes } from '../types'
import {
  findAffectedRegulationsInText,
  findSignatureInText,
} from '../utils/guessers'
import {
  DraftField,
  DraftImpactForm,
  DraftingState,
  HtmlDraftField,
  RegDraftForm,
  RegDraftFormSimpleProps,
} from './types'

const propMap: Record<RegDraftFormSimpleProps, true> = {
  title: true,
  text: true,
  idealPublishDate: true,
  fastTrack: true,
  effectiveDate: true,
  signatureDate: true,
  signatureText: true,
  signedDocumentUrl: true,
  lawChapters: true,
  ministry: true,
  type: true,
  draftingNotes: true,
  authors: true,
  name: true,
}
const draftRootProps = Object.keys(
  propMap,
) as ReadonlyArray<RegDraftFormSimpleProps>

// ---------------------------------------------------------------------------

export const validateImpact = (
  impact: DraftImpactForm,
  state?: DraftingState,
) => {
  validateFieldValue(impact.date, true)
  if (impact.type === 'repeal') {
    return
  }
  validateFieldValue(impact.title, true)
  validateFieldValue(impact.text, true)
  impact.appendixes.forEach((appendix) => {
    if (appendix.revoked) {
      appendix.text.error = undefined
      appendix.title.error = undefined
    } else {
      validateFieldValue(appendix.title, true)
      validateFieldValue(appendix.text, true)
    }
  })
  validateFieldValue(impact.comments, true)
}

// ---------------------------------------------------------------------------

export const validateState = (state: DraftingState) => {
  const { draft } = state

  draftRootProps.forEach((key) => validateFieldValue(draft[key]))
  draft.appendixes.forEach((appendix) => {
    validateFieldValue(appendix.title)
    validateFieldValue(appendix.text)
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(draft.impacts).forEach(([key, impactsList]) => {
    impactsList.forEach((impact) => {
      validateImpact(impact, state)
    })
  })
}
// ---------------------------------------------------------------------------

/**
 * Simply travels the state very, very quickly and check for any already flagged errors
 *
 * Does not perform any new validations.
 */
export const isDraftErrorFree = (state: DraftingState): boolean => {
  const { draft } = state

  const validState =
    !state.error &&
    draftRootProps.every((key) => !draft[key].error) &&
    draft.appendixes.every(({ title, text }) => !title.error && !text.error)

  let validImpacts = true

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(draft.impacts).forEach(([key, impactsList]) => {
    impactsList.forEach((impact) => {
      // skip checking 'repeal' impacts
      if (impact.type === 'amend') {
        const { title, text, appendixes, comments } = impact

        if (
          impact.error ||
          impact.date.error ||
          title.error ||
          text.error ||
          (appendixes.length &&
            appendixes.every(({ title, text }) => title.error || text.error)) ||
          comments.error
        ) {
          validImpacts = false
        }
      }
    })
  })

  return validState && validImpacts
}

// ---------------------------------------------------------------------------

export const isDraftPublishable = (state: DraftingState): boolean =>
  !!state.draft.name.value && isDraftErrorFree(state)

// ---------------------------------------------------------------------------
export const isDraftLocked = (draft: RegDraftForm): boolean =>
  draft.draftingStatus === 'shipped' || draft.draftingStatus === 'published'

// ---------------------------------------------------------------------------

const isHTMLField = (
  field: DraftField<unknown, string>,
): field is HtmlDraftField => field.type === 'html'

const isEmpty = (value: unknown) =>
  Array.isArray(value) ? value.length === 0 : !value

// -------

export const validateFieldValue = <T extends DraftField<unknown, string>>(
  field: T,
  isImpact?: boolean,
) => {
  field.error =
    field.required && isEmpty(field.value)
      ? field.required !== true
        ? field.required
        : errorMsgs.fieldRequired
      : undefined
  field.showError = field.dirty || undefined

  if (isHTMLField(field)) {
    field.warnings = makeHighAngstWarnings(field.value, isImpact)
    const hasWarnings = field.warnings.length > 0 || undefined
    field.error = hasWarnings ? errorMsgs.htmlWarnings : field.error
    field.showError = hasWarnings || field.showError
  }
}

// ---------------------------------------------------------------------------

export const updateFieldValue = <T extends DraftField<unknown, string>>(
  field: T,
  newValue: T['value'],
  isImpact?: boolean,
) => {
  field.value = newValue
  field.dirty = true

  validateFieldValue(field, isImpact)
}

// ---------------------------------------------------------------------------

export const tidyUp = {
  date: (value: string) => value,
  text: (value: string) => value.trimLeft() as PlainText,
  html: (value: HTMLText) => value.trimLeft() as HTMLText,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _: <T>(value: T) => value,
} as const

// ---------------------------------------------------------------------------

/**
 * Checks title and text for possible "mentions" of other regulations.
 *
 * If mentions have changed, then loop through the list of registered
 * impacts and revalidate if they affect regulations that are actually mentioned
 */
const updateImpacts = (
  draft: RegDraftForm,
  title: PlainText,
  text: HTMLText,
) => {
  const { impacts, mentioned, type } = draft

  // Title should only be considered for "breytingareglugerðir" (type: `amending`)
  // because we assume that Stofnreglugerð *title* will never mention another
  // regulation that its changing. Prove us wrong!
  const isAmending = type.value === RegulationDraftTypes.amending
  const checkedTitle = isAmending ? title : ''
  const newMentions = findAffectedRegulationsInText(checkedTitle, text)

  const mentionsChanged =
    newMentions.length !== mentioned.length ||
    mentioned.some((name, i) => name !== newMentions[i])

  if (mentionsChanged) {
    draft.mentioned = newMentions

    if (!isAmending) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(impacts).forEach(([key, impactsList]) => {
        impactsList.forEach((impact) => {
          if (impact.name === 'self') return

          if (newMentions.includes(impact.name)) {
            delete impact.error
          } else {
            impact.error = errorMsgs.impactingUnMentioned
          }
        })
      })
    }
  }
}

// ---------------------------------------------------------------------------

/**
 * Collection of "guessing" logic — setting/updating values/fields that
 * are 100% dependant on other values.
 */
export const derivedUpdates: {
  [Prop in RegDraftFormSimpleProps]?: (
    state: DraftingState,
    newValue: RegDraftForm[Prop]['value'],
  ) => RegDraftForm[Prop]['value'] | null | void
} = {
  /**
   * Derive regulation `type` from wording of title.
   * Re-validate impacts (search for "mentions" of regulation names)
   */
  title: (state: DraftingState, newTitle) => {
    const { type, text } = state.draft

    if (!newTitle) {
      type.showError = undefined
    }
    updateImpacts(state.draft, newTitle, text.value)
  },

  /**
   * Re-validate impacts (search for "mentions" of regulation names)
   */
  text: (state, newValue) => {
    const { title } = state.draft
    updateImpacts(state.draft, title.value, newValue)
  },

  /**
   * Parse the signature block and read the ministry name and signature date.
   *
   * This should effectively enforce conventional/standardized wording
   * of beginning of the signature block.
   */
  signatureText: (state, newValue) => {
    const draft = state.draft
    const { ministryName, signatureDate } = findSignatureInText(newValue)

    updateFieldValue(
      draft.signatureDate,
      signatureDate && new Date(signatureDate),
    )

    const ministryNameNormalized = ministryName?.toLowerCase().replace(/-/g, '')
    const knownMinistry = ministryNameNormalized
      ? state.ministries.find(
          (m) =>
            m.name.toLowerCase().replace(/-/g, '') === ministryNameNormalized,
        )
      : undefined
    // prefer official name over typed name (ignores casing, and punctuation differernces)
    const newMinistryName = knownMinistry ? knownMinistry.name : ministryName
    updateFieldValue(draft.ministry, newMinistryName)

    // TODO: Also match the derived ministry up with original draft author's
    // ministry connnection (i.e. their "place of work")
    // and issue a WARNING if the two ministry values don't match up.
    const hasMinistryError = ministryName && !knownMinistry
    const ministryError = hasMinistryError
      ? errorMsgs.ministryUnknown
      : undefined
    draft.ministry.error = ministryError || draft.ministry.error
    draft.ministry.showError = hasMinistryError || draft.ministry.showError
  },

  idealPublishDate: (state, newValue) => {
    // FIXME: TODO: lower-boundry-check explicitly set impact dates.
  },
}

// ---------------------------------------------------------------------------

export { makeHighAngstWarnings } from '@dmr.is/regulations-tools/useTextWarnings'
