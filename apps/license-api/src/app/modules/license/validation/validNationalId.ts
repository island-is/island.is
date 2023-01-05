import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { isValid } from 'kennitala'

@ValidatorConstraint()
export class ValidNationalId implements ValidatorConstraintInterface {
  validate(natId: number | string): boolean {
    return isValid(natId)
  }
  defaultMessage(): string {
    return 'Invalid national id'
  }
}
