export interface Operator {
  ssn?: string | null
  name?: string | null
  isMainOperator?: boolean | null
}

export interface OperatorChangeValidation {
  hasError: boolean
  errorMessages?: Array<OperatorChangeValidationMessage> | null
}

export interface OperatorChangeValidationMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}
