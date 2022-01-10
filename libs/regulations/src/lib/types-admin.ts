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
import {
  RegName,
  Kennitala,
  ISODate,
  PlainText,
  HTMLText,
  RegulationType,
  URLString,
} from './types'

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
  // email: EmailAddress
  // TODO: Add to this minimal list of fields... "org??"
}

// ---------------------------------------------------------------------------

export type DraftSummary = Pick<DB_RegulationDraft, 'id' | 'title'> & {
  idealPublishDate?: ISODate
  draftingStatus: Exclude<DraftingStatus, 'shipped'>
  authors: ReadonlyArray<Author>
}

export type ShippedSummary = Required<
  Pick<DB_RegulationDraft, 'id' | 'title' | 'name'> & {
    idealPublishDate: ISODate
  }
>

// ---------------------------------------------------------------------------

export type RegulationDraft = {
  /** undefined signifies a new regulation draft */
  id: RegulationDraftId
  draftingStatus: DraftingStatus
  title: PlainText
  name?: RegName
  draftingNotes: HTMLText
  authors: ReadonlyArray<Author>
  lawChapters?: ReadonlyArray<RegulationLawChapter>
  idealPublishDate?: ISODate
  fastTrack?: boolean
  effectiveDate?: ISODate
  signatureDate?: ISODate
  signatureText: HTMLText
  signedDocumentUrl?: URLString
  type?: RegulationType
  ministry?: RegulationMinistry
  impacts: ReadonlyArray<DraftRegulationCancel | DraftRegulationChange>
} & Pick<Regulation, 'text' | 'appendixes' | 'comments'>

// ---------------------------------------------------------------------------

export type DraftImpactName = RegName | 'self'

export type DraftRegulationCancel = {
  type: 'repeal'
  name: DraftImpactName
  regTitle: PlainText
} & Pick<DB_DraftRegulationCancel, 'id' | 'date'>

// ---------------------------------------------------------------------------

export type DraftRegulationChange = {
  type: 'amend'
  name: DraftImpactName
  regTitle: PlainText
} & Pick<DB_DraftRegulationChange, 'id' | 'date' | 'title'> &
  Pick<Regulation, 'text' | 'appendixes' | 'comments'>

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
