import {
  DB_DraftAuthor,
  DB_RegulationDraft,
  DBx_Ministry,
  RegulationDraftId,
  DBx_LawChapter,
  DBx_Regulation,
  DB_DraftRegulationCancel,
  DB_DraftRegulationChange,
} from './types-database'
import { DraftingStatus } from './types'
import { Regulation } from '@island.is/regulations/web'
import { RegName } from '@hugsmidjan/regulations-editor/types'

export type DraftSummary = Pick<
  DB_RegulationDraft,
  'id' | 'title' | 'idealPublishDate'
> & { draftingStatus: Exclude<DraftingStatus, 'shipped'> }

export type ShippedSummary = Required<
  Pick<DB_RegulationDraft, 'id' | 'title' | 'name' | 'idealPublishDate'>
>

// ---------------------------------------------------------------------------

export type RegulationDraft = {
  /** 0 (zero) signifies a new regulation draft */
  id: RegulationDraftId | 0
  authors: ReadonlyArray<Omit<DB_DraftAuthor, 'draftId'>>
  lawChapters: ReadonlyArray<DBx_LawChapter>
  ministry?: DBx_Ministry
  impacts: ReadonlyArray<DraftRegulationCancel | DraftRegulationChange>
} & Omit<DB_RegulationDraft, 'id' | 'ministryId' | 'text'> &
  Pick<Regulation, 'text' | 'appendixes' | 'comments'>

// ---------------------------------------------------------------------------

export type DraftRegulationCancel = DB_DraftRegulationCancel

// ---------------------------------------------------------------------------

export type DraftRegulationChange = Omit<DB_DraftRegulationChange, 'text'> &
  Pick<Regulation, 'text' | 'appendixes' | 'comments'>

// ---------------------------------------------------------------------------

/** List of regulations that the draft impacts (cancels or updates) */
export type RegulationOption = Pick<DBx_Regulation, 'id' | 'name' | 'title'> & {
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
