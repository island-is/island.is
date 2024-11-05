import { FieldTypes } from '../../../enums/fieldTypes'
import { BaseValueType } from '../baseValueType.interface'

export class NumberValue implements BaseValueType {
  type = FieldTypes.NUMBERBOX
  order = 0
  value?: number | null

  constructor(order: number) {
    this.value = null
    this.order = order
  }
}
