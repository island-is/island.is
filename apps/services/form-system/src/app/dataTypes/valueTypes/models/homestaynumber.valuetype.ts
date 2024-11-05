import { FieldTypes } from '../../../enums/fieldTypes'
import { BaseValueType } from '../baseValueType.interface'

export class HomestayNumberValue implements BaseValueType {
  type = FieldTypes.HOMESTAY_NUMBER
  order = 0
  homestayNumber?: string | null

  constructor(order: number) {
    this.homestayNumber = null
    this.order = order
  }
}
