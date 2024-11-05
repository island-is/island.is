import { FieldTypes } from '../../../enums/fieldTypes'
import { BaseValueType } from '../baseValueType.interface'

export class DateValue implements BaseValueType {
  type = FieldTypes.DATE_PICKER
  order = 0
  date?: Date | null

  constructor(order: number) {
    this.date = null
    this.order = order
  }
}
