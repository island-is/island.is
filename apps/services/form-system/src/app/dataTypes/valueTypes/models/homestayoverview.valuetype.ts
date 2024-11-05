import { FieldTypes } from '../../../enums/fieldTypes'
import { BaseValueType } from '../baseValueType.interface'

export class HomeStayOverviewValue implements BaseValueType {
  type = FieldTypes.HOMESTAY_OVERVIEW
  order = 0
  totalDays?: number | null
  totalAmount?: number | null
  year?: number | null
  isNullReport?: boolean | null
  months?: Month[]

  constructor(order: number) {
    this.order = order
    this.totalDays = null
    this.totalAmount = null
    this.year = null
    this.isNullReport = null
    this.months = []
  }
}

class Month {
  month?: number[] | null
  amount?: number | null
  days?: number[] | null
}
