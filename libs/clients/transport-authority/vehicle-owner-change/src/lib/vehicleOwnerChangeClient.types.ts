export interface OwnerChange {
  permno: string
  seller: OwnerChangeSeller
  buyer: OwnerChangeByuer
  dateOfPurchase: Date
  saleAmount: number
  insuranceCompanyCode: string
  insuranceCompanyName?: string | null
  operators?: Array<OwnerChangeOperator> | null
  coOwners?: Array<OwnerChangeCoOwner> | null
}

export interface OwnerChangeSeller {
  ssn: string
  name?: string | null
  email: string
}

export interface OwnerChangeByuer {
  ssn: string
  name?: string | null
  email: string
}

export interface OwnerChangeOperator {
  ssn: string
  name?: string | null
  email: string
  isMainOperator: boolean
}

export interface OwnerChangeCoOwner {
  ssn: string
  name?: string | null
  email: string
}
