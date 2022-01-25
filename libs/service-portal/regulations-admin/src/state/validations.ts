import { HTMLText, PlainText } from '@island.is/regulations'
import { makeHighAngstWarnings } from '@island.is/regulations-tools/useTextWarnings'
import { errorMsgs } from '../messages'
import {
  findAffectedRegulationsInText,
  findRegulationType,
  findSignatureInText,
} from '../utils/guessers'
import { DraftingState, RegDraftForm, RegDraftFormSimpleProps } from './types'

// ---------------------------------------------------------------------------

const tidyUp = {
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
    type.value = findRegulationType(newTitle)
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

    const normalizedValue = ministryName?.toLowerCase().replace(/-/g, '')
    const knownMinistry = normalizedValue
      ? state.ministries.find(
          (m) => m.name.toLowerCase().replace(/-/g, '') === normalizedValue,
        )
      : undefined

    // prefer official name over typed name (ignores casing, and punctuation differernces)
    draft.ministry.value = knownMinistry ? knownMinistry.name : ministryName
    // Ideally this ought to be flagged as a less-severe error
    draft.ministry.error =
      ministryName && !knownMinistry ? errorMsgs.ministryUnknown : undefined

    // TODO: Match the derived ministry up with original draft author's
    // ministry connnection (i.e. their "place of work")
    // and issue a WARNING if the two ministry values don't match up.

    draft.signatureDate.value = signatureDate && new Date(signatureDate)
  },
}

// ---------------------------------------------------------------------------

export const makeHTMLWarnings = makeHighAngstWarnings
