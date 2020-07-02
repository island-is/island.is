import { Condition } from '../condition'
import { FieldTypes, Option, ValidationError } from './base'
import { Question } from './question'

export class CheckboxField extends Question {
  options: Option[]
  constructor(data: {
    condition?: Condition
    id: string
    name: string
    options: Option[]
    isRequired: boolean
  }) {
    const { condition, id, name, options, isRequired } = data
    super({ condition, id, isRequired, name, type: FieldTypes.CHECKBOX })
    this.options = options
  }

  validate(answer: any): ValidationError {
    if (this.isRequired && !answer) {
      return { error: 'this is required' }
    }
    return {}
  }
}
