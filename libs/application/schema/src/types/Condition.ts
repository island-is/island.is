export enum Comparators {
  EQUALS = 'eq',
  NOT_EQUAL = 'neq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
}

export interface ConditionalCheck {
  questionId: string
  comparator: Comparators
  value: string
}

export interface Condition {
  show: boolean
  on: 'all' | 'any'
  check: ConditionalCheck[]
}
