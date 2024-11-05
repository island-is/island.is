import { FieldTypes } from '../../../enums/fieldTypes'
import { BaseValueType } from '../baseValueType.interface'

export class Message implements BaseValueType {
  type = FieldTypes.MESSAGE
  order = 0
  message?: string | null

  constructor(order: number) {
    this.message = null
    this.order = order
  }
}
