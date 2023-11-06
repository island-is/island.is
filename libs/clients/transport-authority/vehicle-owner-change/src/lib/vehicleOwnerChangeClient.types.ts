export interface OwnerChange {
  permno: string
  seller: OwnerChangeSeller
  buyer: OwnerChangeByuer
  dateOfPurchase: Date
  dateOfPurchaseTimestamp: string
  saleAmount: number
  mileage?: number | null
  insuranceCompanyCode?: string | null
  operators?: Array<OwnerChangeOperator> | null
  coOwners?: Array<OwnerChangeCoOwner> | null
}

export interface OwnerChangeSeller {
  ssn: string
  email: string
}

export interface OwnerChangeByuer {
  ssn: string
  email: string
}

export interface OwnerChangeOperator {
  ssn: string
  email: string | null
  isMainOperator: boolean
}

export interface OwnerChangeCoOwner {
  ssn: string
  email: string
}

export interface NewestOwnerChange {
  permno: string
  ownerSsn: string
  ownerName?: string
  dateOfPurchase: Date
  saleAmount: number
  insuranceCompanyCode: string
  insuranceCompanyName?: string | null
}

export interface OwnerChangeValidation {
  hasError: boolean
  errorMessages?: Array<OwnerChangeValidationMessage> | null
}

export interface OwnerChangeValidationMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}
