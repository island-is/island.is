export interface OwnerChange {
  permno: string
  seller: OwnerChangeSeller
  buyer: OwnerChangeByuer
  dateOfPurchase: Date
  saleAmount: number
  insuranceCompanyCode?: string
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
  email: string
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
