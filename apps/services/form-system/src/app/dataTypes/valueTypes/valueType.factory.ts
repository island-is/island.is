import { FieldTypes } from '../../enums/fieldTypes'
import { CandidateValue } from './models/candidate.valuetype'
import { HomeStayOverviewValue } from './models/homestayoverview.valuetype'
import { NumberValue } from './models/number.valuetype'
import { TextboxValue } from './models/textbox.valuetype'

export class ValueFactory {
  static getClass(type: string) {
    switch (type) {
      case FieldTypes.TEXTBOX:
        return TextboxValue
      case FieldTypes.NUMBERBOX:
        return NumberValue
      case FieldTypes.CANDITATE:
        return CandidateValue
      case FieldTypes.HOMESTAY_OVERVIEW:
        return HomeStayOverviewValue
      default:
        throw new Error('Invalid type')
    }
  }
}
