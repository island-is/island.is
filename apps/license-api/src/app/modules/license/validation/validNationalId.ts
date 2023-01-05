import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { isValid } from 'kennitala'

@ValidatorConstraint()
export class ValidNationalId implements ValidatorConstraintInterface {
  validate(natId: string): boolean {
    const lengthCondition = natId.length >= 10 && natId.length <= 10
    return isValid(natId) && lengthCondition
  }
  defaultMessage(): string {
    return 'Invalid national id'
  }
}
