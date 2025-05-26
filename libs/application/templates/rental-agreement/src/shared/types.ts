export type ApplicantsInfo = {
  nationalIdWithName: { name: string; nationalId: string }
  phone: string
  address: string
  email: string
  isRepresentative: string[]
}

export type CostField = {
  description: string
  amount?: number
  hasError?: boolean
}
