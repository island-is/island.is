export interface HomeLodgingYear {
  year: number
  returned: boolean
}

export interface HomeLodging {
  id: string
  years: HomeLodgingYear[]
  address: string
  /** Postal code and city as returned by Sýslumenn, e.g. "101 Reykjavík". */
  postalCode: string
  propertyNumber?: string
  apartmentNumber?: string
  guests?: number
  rooms?: number
}

export interface OvernightStayDateRange {
  from: string
  to: string
  amount?: number
}

export interface OvernightStayMonth {
  month: number
  dateRanges: OvernightStayDateRange[]
  numberOfNights: number
  rentalIncome: number
}

export interface OvernightStaySubmission {
  homeLodgingId: string
  year: number
  advertisementUrls: string[]
  hasActiveAdvertisement: boolean
  nights: OvernightStayMonth[]
  comments?: string
}

export interface OvernightStaySubmissionResponse {
  id: string
  submittedAt: string
  errors: string[]
}
