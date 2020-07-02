import { BaseField, ValidationError } from './base'
import { Condition } from '../condition'

export class Question implements BaseField {
  readonly children: undefined
  condition: Condition
  readonly id: string
  isRequired?: true
  readonly name: string
  readonly type: string

  readonly isQuestion = true
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate?(answer: any): ValidationError

  protected constructor({ condition, id, isRequired, name, type }) {
    this.condition = condition
    this.id = id
    this.isRequired = isRequired
    this.name = name
    this.type = type
  }
}
