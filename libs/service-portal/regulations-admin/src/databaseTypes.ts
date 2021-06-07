// Draft of the required database types

import {
  DraftingStatus,
  HTMLText,
  ISODate,
  Kennitala,
  PlainText,
  RegName,
  RegulationType,
} from './types'

// ---------------------------------------------------------------------------
// Branded types refering to data structures loaded from Reglugerðagrunnur

declare const _ExtRegulationId__Brand: unique symbol
export type ExtRegulationId = number & { [_ExtRegulationId__Brand]: true }

declare const _ExtLawChapterId__Brand: unique symbol
export type ExtLawChapterId = number & { [_ExtLawChapterId__Brand]: true }

declare const _ExtMinistryId__Brand: unique symbol
export type ExtMinistryId = number & { [_ExtMinistryId__Brand]: true }

// ===========================================================================

declare const _RegulationDraftId__Brand: unique symbol
export type RegulationDraftId = number & { [_RegulationDraftId__Brand]: true }

export type DB_RegulationDraft = {
  /** Primary key */
  id: RegulationDraftId

  /** The title of the regulation */
  title: PlainText

  /** The regulation text, including appendixes (and hypothetiaclly editor's comments). */
  text: HTMLText

  /** Memos/comments relating to the registration process.
   *
   * May include email-addresses or phone numbers of people working on the draft.
   */
  draftingNotes: HTMLText

  draftingStatus: DraftingStatus

  /** Requested date of publication in Stjórnartíðindi.
   *
   * Empty means "At the next convenient date" which may be a day or two in the future.
   *
   * A Date a (working) day or two into the future signifies a preference for that date.
   *
   * Current (or past) date means "As soon as humanly possible — drop everything"
   *
   * A future date set on an **immediate** weekend or national holiday also signifies a request for special fast-tracking.
   */
  idealPublishDate?: ISODate

  ministryId?: ExtMinistryId

  /** Date signed in the ministry */
  signatureDate?: ISODate

  /** Date when the regulation took effect for the first time */
  effectiveDate?: ISODate

  type?: RegulationType

  /** Name (publication id) provided by Stjórnartíðindi's systems as part of  */
  name?: RegName
}

// ===========================================================================

declare const _DraftAuthorId__Brand: unique symbol
export type DraftAuthorId = number & { [_DraftAuthorId__Brand]: true }

export type DB_DraftAuthor = {
  /** Primary key */
  id: DraftAuthorId
  draftId: RegulationDraftId
  /** the kennitala of the author/contact that authored this RegulationDraft (including "editors") */
  authorKt?: Kennitala
}

// ===========================================================================

declare const _DraftLawChapterId__Brand: unique symbol
export type DraftLawChapterId = number & { [_DraftLawChapterId__Brand]: true }

export type DB_DraftLawChapter = {
  /** Primary key */
  id: DraftLawChapterId
  draftId: RegulationDraftId
  lawChapterId?: ExtLawChapterId
}

// ===========================================================================

declare const _DraftRegulationCancelId__Brand: unique symbol
export type DraftRegulationCancelId = number & {
  [_DraftRegulationCancelId__Brand]: true
}

export type DB_DraftRegulationCancel = {
  /** Primary key */
  id: DraftRegulationCancelId
  changingId: RegulationDraftId
  regulationId: ExtRegulationId
  date: ISODate
}

// ===========================================================================

declare const _DraftRegulationChangeId__Brand: unique symbol
export type DraftRegulationChangeId = number & {
  [_DraftRegulationChangeId__Brand]: true
}

export type DB_DraftRegulationChange = {
  /** Primary key */
  id: DraftRegulationChangeId
  changingId: RegulationDraftId
  regulationId: ExtRegulationId
  date: ISODate
  title: PlainText
  text: HTMLText
}
