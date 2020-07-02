import { Condition } from '../condition'
import { FieldTypes, ValidationError } from './base'
import { Question } from './question'

export class TextField extends Question {
  constructor(data: {
    condition?: Condition
    id: string
    name: string
    isRequired: boolean
  }) {
    const { condition, id, name, isRequired } = data
    super({ condition, id, isRequired, name, type: FieldTypes.TEXT })
  }

  validate(answer: string): ValidationError {
    if (this.isRequired && !answer) {
      return { error: 'this is required' }
    }
    return {}
  }
}
