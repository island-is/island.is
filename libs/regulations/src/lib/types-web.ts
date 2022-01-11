import {
  Year,
  ISODate,
  RegName,
  PlainText,
  HTMLText,
  MinistrySlug,
  Appendix,
} from './types'

// Years
export type RegulationYears = ReadonlyArray<Year>

// ---------------------------------------------------------------------------

// Regulations list
export type RegulationListItem = {
  /** Publication name */
  name: RegName
  /** The title of the Regulation */
  title: string
  /** The ministry that the regulation is linked to */
  ministry?: Ministry
  /** Publication date of this regulation */
  publishedDate: ISODate
}

export type RegulationSearchResults = {
  /** The number of the current page, 1-based  */
  page: number
  /** Total number of pages available for this query */
  perPage: number
  /** Total number of pages available for this query */
  totalPages: number
  /** Total number of items found for this query */
  totalItems: number
  /** ReguationListItems for this page */
  data: Array<RegulationListItem>
}

// ---------------------------------------------------------------------------

export enum RegulationViewTypes {
  current = 'current',
  diff = 'diff',
  original = 'original',
  d = 'd',
}

export enum RegulationOriginalDates {
  gqlHack = '0101-01-01',
  api = 'original',
}

// ---------------------------------------------------------------------------

/** Input data for regulation PDF generation */
export type RegulationPdfInput = {
  title: PlainText
  text: HTMLText
  appendixes: Array<Appendix>
  comments: HTMLText
  name: RegName
  publishedDate: ISODate
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
