import { FormValue, ExternalData } from './Application'

export enum Comparators {
  EQUALS = 'eq',
  NOT_EQUAL = 'neq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notcontains',
}

export enum AllOrAny {
  ALL = 'all',
  ANY = 'any',
}

type BaseStaticCheck = {
  isMultiCheck?: false
  comparator: Comparators
  value: string | number
}

type QuestionCheck = BaseStaticCheck & {
  questionId: string
  externalDataId?: never
}

type ExternalDataCheck = BaseStaticCheck & {
  questionId?: never
  externalDataId: string
}

export type StaticCheck = QuestionCheck | ExternalDataCheck

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
