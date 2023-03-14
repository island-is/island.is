export interface CardResponse {
  isInsured?: boolean | null
  // national registry id
  applicantNationalId?: string | null
  // valid cards
  canApply?: boolean | null
  cards?: CardInfo[] | null
}

export interface CardInfo {
  cardNumber?: string | null
  cardType?: string | null
  sentStatus?: string | null
  comment?: string | null
  isPlastic?: boolean
  isTemp?: boolean
}

export interface NationalRegistry {
  nationalId: string
}

export interface TempData {
  data?: string | null
  fileName?: string | null
  contentType?: string | null
}

export interface ApplicantCard {
  nrid: string | null
  cardNumber: string | null
}
