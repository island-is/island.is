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
} & Omit<DB_RegulationDraft, 'id' | 'ministryId' | 'text'> &
  Pick<Regulation, 'text' | 'appendixes' | 'comments'>

// ---------------------------------------------------------------------------

export type DraftRegulationCancel = DB_DraftRegulationCancel

// ---------------------------------------------------------------------------

export type DraftRegulationChange = Omit<DB_DraftRegulationChange, 'text'> &
  Pick<Regulation, 'text' | 'appendixes' | 'comments'>

// ---------------------------------------------------------------------------

/** List of regulations that the draft impacts (cancels or updates) */
export type RegulationOption = (
  | {
      id: DBx_Regulation['id']
      /** True if the regulation has been fully migrated */
      migrated: true
    }
  | {
      id?: undefined
      /** True if the regulation has been fully migrated */
      migrated: false
    }
) &
  Pick<DBx_Regulation, 'name' | 'title'>

export type RegulationList = Array<RegulationOption>
