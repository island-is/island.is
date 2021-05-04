export class DelegationDTO {
  fromNationalId!: string
  fromDisplayName!: string
  isFromCompany!: boolean
  toNationalId!: string
  validFrom!: Date
  validTo?: Date
  validCount?: number
  name!: string
}
