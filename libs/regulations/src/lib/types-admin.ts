/* eslint-disable @typescript-eslint/naming-convention */
import {
  DB_RegulationDraft,
  DBx_Regulation,
  DB_DraftRegulationCancel,
  DB_DraftRegulationChange,
  DraftingStatus,
  RegulationDraftId,
} from './types-admin-database'
import {
  Regulation,
  RegulationLawChapter,
  RegulationMinistry,
} from './types-web'
import { RegName, Kennitala } from './types'

export type {
  DraftingStatus,
  RegulationDraftId,
  DraftRegulationChangeId,
  DraftRegulationCancelId,
} from './types-admin-database'

declare const _EmailAddress__Brand: unique symbol
/** Normal email address. Not to be confused with random un-parsed strings. */
export type EmailAddress = string & { [_EmailAddress__Brand]: true }

export type Author = {
  authorId: Kennitala
  name: string
  email: EmailAddress
  // TODO: Add to this minimal list of fields... "org??"
}

// ---------------------------------------------------------------------------

export type DraftSummary = Pick<
  DB_RegulationDraft,
  'id' | 'title' | 'idealPublishDate'
> & {
  draftingStatus: Exclude<DraftingStatus, 'shipped'>
  authors: ReadonlyArray<Author>
}

export type ShippedSummary = Required<
  Pick<DB_RegulationDraft, 'id' | 'title' | 'name' | 'idealPublishDate'>
>

// ---------------------------------------------------------------------------

export type RegulationDraft = {
  /** 0 (zero) signifies a new regulation draft */
  id: RegulationDraftId | 0
  authors: ReadonlyArray<Author>
  lawChapters: ReadonlyArray<RegulationLawChapter>
  ministry?: RegulationMinistry
  impacts: ReadonlyArray<DraftRegulationCancel | DraftRegulationChange>
} & Omit<DB_RegulationDraft, 'id' | 'ministryId' | 'text'> &
  Pick<Regulation, 'text' | 'appendixes' | 'comments'>

// ---------------------------------------------------------------------------

export type DraftRegulationCancel = {
  type: 'repeal'
  name: RegName | 'self'
} & Pick<DB_DraftRegulationCancel, 'id' | 'date'>

// ---------------------------------------------------------------------------

export type DraftRegulationChange = {
  type: 'amend'
  name: RegName | 'self'
} & Pick<DB_DraftRegulationChange, 'id' | 'date' | 'title'> &
  Pick<Regulation, 'text' | 'appendixes' | 'comments'>

// ---------------------------------------------------------------------------

/** List of regulations that the draft impacts (cancels or updates) */
export type RegulationOption = Pick<DBx_Regulation, 'name' | 'title'> & {
  /** True if the regulation has been fully migrated
   *
   * Used to prevent any text-changes to be made (cancelling is OK)
   */
  migrated: boolean
  /** True if the regulation has already been cancelled/repealed (Brottfelld)
   *
   * Used to display warning
   */
  cancelled?: true
}

export type RegulationList = Array<RegulationOption>

// ---------------------------------------------------------------------------

export type RegulationVersion = Pick<
  Regulation,
  'title' | 'text' | 'appendixes' | 'comments' | 'effectiveDate'
> & {
  /** Name of the Regulation that prescribed this change */
  changedBy?: RegName
}

export type RegulationCancellation = {
  /** Date of cancellation */
  effectiveDate: Regulation['effectiveDate']
  /** Name of the Regulation that prescribes this cancellation */
  cancelledBy?: RegName
}

/** List of all versions of a regulation — including future versions */
export type RegulationHistory = Array<
  RegulationVersion | RegulationCancellation
>
