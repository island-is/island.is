import { ValidationMessage } from '@island.is/clients/transport-authority/vehicle-owner-change'

export interface Operator {
  ssn?: string | null
  name?: string | null
  isMainOperator?: boolean | null
}

export interface OperatorChangeValidation {
  hasError: boolean
  errorMessages?: Array<ValidationMessage>
  infoMessages?: Array<ValidationMessage>
}
