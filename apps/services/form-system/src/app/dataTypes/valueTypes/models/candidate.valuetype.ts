import { FieldTypes } from '../../../enums/fieldTypes'
import { BaseValueType } from '../baseValueType.interface'

export class CandidateValue implements BaseValueType {
  type = FieldTypes.CANDITATE
  order = 0
  kennitala?: string | null
  name?: string | null
  address?: string | null
  postalCode?: string | null
  municipality?: string | null
  jobTitle?: string | null
  altName?: string | null

  constructor(order: number) {
    this.order = order
    this.kennitala = null
    this.name = null
    this.address = null
    this.postalCode = null
    this.municipality = null
    this.jobTitle = null
    this.altName = null
  }
}
