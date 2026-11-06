export interface HomeLodgingRegistration {
  id: string
  year: number
  hasBeenSubmitted: boolean
  name: string
  address: string
  postalCode: string
  city: string
  propertyNumber: string
  unitNumber: string
  guestCount: number
  roomCount: number
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
