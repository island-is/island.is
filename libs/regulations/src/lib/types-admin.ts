/* eslint-disable @typescript-eslint/naming-convention */
import {
  DraftingStatus,
  DraftRegulationCancelId,
  DraftRegulationChangeId,
  RegulationDraftId,
} from './types-admin-database'
import {
  RegName,
  Kennitala,
  ISODate,
  PlainText,
  HTMLText,
  URLString,
  RegulationType,
  Regulation,
  LawChapter,
  Ministry,
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

export type DraftSummary = Pick<
  RegulationDraft,
  'id' | 'title' | 'idealPublishDate' | 'fastTrack' | 'authors'
> & {
  draftingStatus: Extract<DraftingStatus, 'draft' | 'proposal'>
}

export type ShippedSummary = Pick<
  RegulationDraft,
  'id' | 'title' | 'name' | 'idealPublishDate'
> & {
  draftingStatus: Extract<DraftingStatus, 'shipped' | 'published'>
}

// ---------------------------------------------------------------------------

export type RegulationDraft = Pick<
  Regulation,
  'text' | 'appendixes' | 'comments'
> & {
  /** undefined signifies a new regulation draft */
  id: RegulationDraftId
  draftingStatus: DraftingStatus
  title: PlainText
  name?: RegName
  draftingNotes: HTMLText
  authors: ReadonlyArray<Author>
  lawChapters?: ReadonlyArray<LawChapter>
  idealPublishDate?: ISODate
  fastTrack?: boolean
  effectiveDate?: ISODate
  signatureDate?: ISODate
  signatureText: HTMLText
  signedDocumentUrl?: URLString
  type?: RegulationType
  ministry?: Ministry
  impacts: ReadonlyArray<DraftImpact>
}

// ---------------------------------------------------------------------------

export type DraftImpactName = RegName | 'self'

export type DraftRegulationCancel = {
  type: 'repeal'
  name: DraftImpactName
  regTitle: PlainText
  id: DraftRegulationCancelId
  date: ISODate
}

// ---------------------------------------------------------------------------

export type DraftRegulationChange = {
  id: DraftRegulationChangeId
  type: 'amend'
  name: DraftImpactName
  regTitle: PlainText
  date: ISODate
  title: PlainText
} & Pick<Regulation, 'text' | 'appendixes' | 'comments'>

// ---------------------------------------------------------------------------

export type DraftImpactId = DraftRegulationChangeId | DraftRegulationCancelId

export type DraftImpact = DraftRegulationChange | DraftRegulationCancel

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
