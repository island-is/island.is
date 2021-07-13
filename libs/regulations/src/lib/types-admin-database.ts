/* eslint-disable @typescript-eslint/naming-convention */
// Draft of the required database types
import {
  HTMLText,
  ISODate,
  PlainText,
  RegName,
  LawChapterSlug,
  MinistrySlug,
  RegulationType,
  Kennitala,
} from './types'

// ---------------------------------------------------------------------------

/** Regulation drafts have three lifecycle states:
 *
 * `draft` = The regulation is still being drafted. Do NOT edit and/or publish!
 * `proposal` = The regulation is ready for a final review/tweaking by an editor.
 * `shipped` = The regulation has been sent to Stjórnartíðindi and is awaiting formal publication.
 */
export type DraftingStatus = 'draft' | 'proposal' | 'shipped'

// ===========================================================================

declare const _RegulationDraftId__Brand: unique symbol
export type RegulationDraftId = string & { [_RegulationDraftId__Brand]: true }

export type DB_RegulationDraft = {
  /** Primary key */
  id: RegulationDraftId

  drafting_status: DraftingStatus

  name?: RegName

  /** The title of the regulation */
  title: PlainText

  /** The regulation text, including appendixes (and hypothetiaclly editor's comments). */
  text: HTMLText

  /** Memos/comments relating to the registration process.
   *
   * May include email-addresses or phone numbers of people working on the draft.
   */
  drafting_notes: HTMLText

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
  ideal_publish_date?: ISODate

  ministry_id?: MinistrySlug

  law_chapters?: LawChapterSlug[]

  /** Date signed in the ministry */
  signature_date?: ISODate

  /** Date when the regulation took effect for the first time */
  effective_date?: ISODate

  type?: RegulationType

  authors?: Kennitala[]

  changes?: DB_DraftRegulationChange[]

  cancel?: DB_DraftRegulationCancel
}

// ===========================================================================

declare const _DraftRegulationCancelId__Brand: unique symbol
export type DraftRegulationCancelId = string & {
  [_DraftRegulationCancelId__Brand]: true
}

export type DB_DraftRegulationCancel = {
  /** Primary key */
  id: DraftRegulationCancelId
  changing_id: RegulationDraftId
  regulation: RegName
  date: ISODate
}

// ===========================================================================

declare const _DraftRegulationChangeId__Brand: unique symbol
export type DraftRegulationChangeId = string & {
  [_DraftRegulationChangeId__Brand]: true
}

export type DB_DraftRegulationChange = {
  /** Primary key */
  id: DraftRegulationChangeId
  changing_id: RegulationDraftId
  regulation: RegName
  date: ISODate
  title: PlainText
  text: HTMLText
}

// ===========================================================================
// DBx Structures loaded from "Reglugerðagrunnur"
// ===========================================================================

// ===========================================================================

declare const _LawChapterId__Brand: unique symbol
export type LawChapterId = number & { [_LawChapterId__Brand]: true }

export type DBx_LawChapter = {
  /** Primary key */
  id: LawChapterId
  title: string
  slug: LawChapterSlug
  parentId?: LawChapterId
}

// ===========================================================================

declare const _RegulationId__Brand: unique symbol
/** Id of a Regulation entry in the Reglugerðagrunnur */
export type RegulationId = number & { [_RegulationId__Brand]: true }

type RegulationMigrationStatus =
  | 'raw'
  | 'unsafe'
  | 'draft'
  | 'text_locked'
  | 'migrated'

export type DBx_Regulation /* Exceprt */ = {
  /** Primary key */
  id: RegulationId
  name: RegName
  title: PlainText
  text: HTMLText
  signatureDate: Date
  publishedDate: Date
  effectiveDate: Date
  status: RegulationMigrationStatus
  type: RegulationType
}
