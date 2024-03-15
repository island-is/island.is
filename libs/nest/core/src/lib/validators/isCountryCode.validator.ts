import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { countries } from 'countries-list'

@ValidatorConstraint({ async: false })
export class IsoCountryCodeValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return Object.hasOwnProperty.call(countries, value.toUpperCase())
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid ISO 3166-1 alpha-2 country code`
  }
}
