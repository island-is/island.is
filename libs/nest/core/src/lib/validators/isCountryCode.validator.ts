import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { IsoCountryCode } from '../types/countryCode.enum'

@ValidatorConstraint({ async: false })
export class IsoCountryCodeValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return Object.values(IsoCountryCode).includes(value as IsoCountryCode)
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid ISO 3166-1 alpha-2 country code`
  }
}
