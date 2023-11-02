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
  nationalId: string | null
  cardNumber: string | null
}

export enum CardType {
  PLASTIC = '1',
  PDF = '2',
}

export enum FormApplyType {
  APPLYING_FOR_PDF = 'applyForPDF',
  APPLYING_FOR_PLASTIC = 'delimitations.applyForPlastic',
}

export interface Answer {
  delimitations: CardAnswer
}

export interface CardAnswer {
  applyForPlastic: string[]
  addForPDF: string[]
}
