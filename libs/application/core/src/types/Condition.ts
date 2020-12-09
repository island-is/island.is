import { FormValue, ExternalData } from './Application'

export enum Comparators {
  EQUALS = 'eq',
  NOT_EQUAL = 'neq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
}

export enum AllOrAny {
  ALL = 'all',
  ANY = 'any',
}

export interface StaticCheck {
  isMultiCheck?: false
  questionId: string
  comparator: Comparators
  value: string | number
}

export type DynamicCheck = (
  formValue: FormValue,
  externalData: ExternalData,
) => boolean

export type SingleConditionCheck = StaticCheck | DynamicCheck

export interface MultiConditionCheck {
  isMultiCheck: true
  show: boolean
  on: AllOrAny
  check: SingleConditionCheck[]
}

export type Condition = MultiConditionCheck | SingleConditionCheck
