import { Condition } from '../condition'
import { FieldTypes, ValidationError } from './base'
import { Question } from './question'
import { isAfter, isBefore } from 'date-fns'

export class DateField extends Question {
  maxDate?: Date
  minDate?: Date

  constructor(data: {
    condition?: Condition
    id: string
    name: string
    maxDate?: Date
    minDate?: Date
    isRequired: boolean
  }) {
    const { condition, id, name, maxDate, minDate, isRequired } = data
    super({ condition, id, isRequired, name, type: FieldTypes.DATE })
    this.maxDate = maxDate
    this.minDate = minDate
  }

  validate(answer: any): ValidationError {
    const { isRequired, maxDate, minDate } = this
    if (isRequired && !answer) {
      return { error: 'this is required' }
    }
    if (maxDate && isAfter(answer, maxDate)) {
      return { error: 'your answer is too far in the future' }
    }
    if (minDate && isBefore(answer, minDate)) {
      return { error: 'your answer is too far in the past' }
    }
    return {}
  }
}
