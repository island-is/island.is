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

export enum SentStatus {
  SENT,
  // Has been returned to sender
  RETURNED,
  // Is in progress, waiting to be sent
  WAITING,
}

// Plastic card, Temporary card
export enum CardType {
  PHYSICAL,
  TEMPORARY,
}

export interface ApplicantCard {
  nrid: string | null
  cardNumber: string | null
}
