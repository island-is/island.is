export interface CardInfo {
  cardNumber?: string | null
  expiryDate?: Date
  issued?: Date
  sent?: Date
  resent?: Date
  cardType?: string | null
  sentStatus?: string | null
  comment?: string | null
}

export interface CardResponse {
  applicantNationalId?: string | null
  isInsured?: boolean | null
  cards?: Array<CardInfo> | null
}
