export interface CardResponse {
  isInsured: boolean
  // national registry id
  nrid: string
  // valid cards
  cards: CardInfo[]
}

export interface CardInfo {
  id: number | string
  expires: Date
  issued: Date
  // When resent
  reSent: Date
  // When was is it sent
  sent: Date
  type: CardType
  sentStatus: SentStatus
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
