/* eslint-disable @typescript-eslint/naming-convention */
import {
  DB_DraftRegulationCancel,
  DB_DraftRegulationChange,
  DraftingStatus,
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
  Appendix,
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
  impacts: ReadonlyArray<DraftRegulationCancel | DraftRegulationChange>
}

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

// ---------------------------------------------------------------------------

/** Input data for regulation PDF generation */
export type RegulationPdfInput = {
  title: PlainText
  text: HTMLText
  appendixes: Array<Appendix>
  comments: HTMLText
  name?: RegName
  publishedDate?: ISODate
}

/** API response from regulation API */
export type RegulationPdfResponse = {
  /** Filename of generated PDF */
  fileName: string

  /** base64 of pdf */
  data: string
}

/** Info about how to download a PDF regulation */
export type RegulationPdfDownload = {
  /** Does the download go through the download service? */
  downloadService?: boolean
  url?: string
}

/** PDF data of a regulation with optional filename */
export type RegulationPdfData = {
  buffer: Buffer
  filename?: string
}

/** Container for an API request for a PDF, either data or error */
export type RegulationPdf =
  | {
      data: RegulationPdfData
      error?: never
    }
  | {
      data?: never
      error: string
    }
