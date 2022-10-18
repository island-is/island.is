export interface OwnerChange {
  permno: string
  sellerSsn: string
  sellerEmail?: string | null
  buyerSsn: string
  buyerEmail?: string | null
  dateOfPurchase: Date
  saleAmount: number
  insuranceCompanyCode: string
  useGroup?: string | null
  operators?: Array<OwnerChangeOperator> | null
  coOwners?: Array<OwnerChangeCoOwner> | null
}

export interface OwnerChangeOperator {
  ssn: string
  isMainOperator: boolean
}

export interface OwnerChangeCoOwner {
  ssn: string
}
