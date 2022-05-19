import { Year, ISODate, RegName, Ministry } from './types'

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
