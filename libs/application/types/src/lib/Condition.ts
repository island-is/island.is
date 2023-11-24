import { FormValue, ExternalData } from './Application'
import { User } from 'user'

export enum Comparators {
  EQUALS = 'eq',
  NOT_EQUAL = 'neq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  CONTAINS = 'in',
  NOT_CONTAINS = 'nin',
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
  userPropId?: never
}

type ExternalDataCheck = BaseStaticCheck & {
  questionId?: never
  externalDataId: string
  userPropId?: never
}

type UserPropCheck = BaseStaticCheck & {
  questionId?: never
  externalDataId?: never
  userPropId: string
}

export type StaticCheck = QuestionCheck | ExternalDataCheck | UserPropCheck

export type DynamicCheck = (
  formValue: FormValue,
  externalData: ExternalData,
  user: User | null,
) => boolean

export type SingleConditionCheck = StaticCheck | DynamicCheck

export interface MultiConditionCheck {
  isMultiCheck: true
  show: boolean
  on: AllOrAny
  check: SingleConditionCheck[]
}

export type Condition = MultiConditionCheck | SingleConditionCheck
