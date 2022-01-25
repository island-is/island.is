import { HTMLText, PlainText } from '@island.is/regulations'
import { makeHighAngstWarnings } from '@island.is/regulations-tools/useTextWarnings'
import { errorMsgs } from '../messages'
import {
  findAffectedRegulationsInText,
  findRegulationType,
  findSignatureInText,
} from '../utils/guessers'
import {
  DraftField,
  DraftingState,
  HtmlDraftField,
  RegDraftForm,
  RegDraftFormSimpleProps,
} from './types'

// ---------------------------------------------------------------------------

const isHTMLField = (
  field: DraftField<unknown, string>,
): field is HtmlDraftField => field.type === 'html'

// -------

export const updateFieldValue = <T extends DraftField<unknown, string>>(
  field: T,
  newValue: T['value'],
  explicit?: boolean,
) => {
  if (newValue !== field.value || explicit === true) {
    field.value = newValue
    field.dirty = true

    if (isHTMLField(field)) {
      field.warnings = makeHTMLWarnings(field.value, true)
    }
    field.error =
      field.required && !field.value ? errorMsgs.fieldRequired : undefined
    field.hideError = !field.dirty
  }
}

// ---------------------------------------------------------------------------

export const tidyUp = {
  text: (value: string) => value.trimLeft() as PlainText,
  html: (value: HTMLText) => value.trimLeft() as HTMLText,
  _: <T extends unknown>(value: T) => value,
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

  const checkedTitle = type.value === 'amending' ? title : ''
  const newMentions = findAffectedRegulationsInText(checkedTitle, text)

  const mentionsChanged =
    newMentions.length !== mentioned.length ||
    mentioned.some((name, i) => name !== newMentions[i])

  if (mentionsChanged) {
    draft.mentioned = newMentions
    impacts.forEach((impact) => {
      if (impact.name === 'self') return

      if (newMentions.includes(impact.name)) {
        delete impact.error
      } else {
        impact.error = errorMsgs.impactingUnMentioned
      }
    })
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
    const derivedType = findRegulationType(newTitle)
    updateFieldValue(type, derivedType)
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
    const unknownMinistryError =
      ministryName && !knownMinistry ? errorMsgs.ministryUnknown : undefined
    draft.ministry.error = unknownMinistryError || draft.ministry.error
    draft.ministry.hideError = !unknownMinistryError
  },
}

// ---------------------------------------------------------------------------

export const makeHTMLWarnings = makeHighAngstWarnings
