import { FieldTypes } from '../../../enums/fieldTypes'
import { BaseValueType } from '../baseValueType.interface'

export class TextboxValue implements BaseValueType {
  type = FieldTypes.TEXTBOX
  order = 0
  value?: string | null

  constructor(order: number) {
    this.value = null
    this.order = order
  }
}
