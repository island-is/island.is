import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

export const ReturnUrlRequired = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'returnUrlRequired',
      target: (object as { constructor: NewableFunction }).constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const obj = args.object as { returnUrl?: string }
          if (value && !obj.returnUrl) {
            return false
          }
          return true
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} can only have a value if returnUrl is also provided.`
        },
      },
    })
  }
}

/**
 * Fields shared by every kind of payment flow, whatever is being paid for.
 */
export class BasePaymentFlowInput {
  @IsString()
  @Length(10, 10, {
    message: 'payerNationalId must be exactly 10 characters long',
  })
  @Matches(/^\d+$/, {
    message: 'payerNationalId must contain only numeric characters',
  })
  @ApiProperty({
    description: 'National id of the payer, can be a company or an individual',
    type: String,
  })
  payerNationalId!: string

  @IsString()
  @IsNotEmpty({ message: 'onUpdateUrl cannot be empty' })
  @ApiProperty({
    description:
      'URL callback to be called on payment update events like when the user requests to create invoice rather than directly paying',
    type: String,
  })
  onUpdateUrl!: string

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Arbitrary JSON data that will be returned with the onUpdateUrl callback',
    type: Object,
    example: { applicationId: 'abc123' },
  })
  metadata?: object

  @ApiPropertyOptional({
    description: 'The url to redirect to on successful payment',
  })
  @IsOptional()
  @IsUrl({ require_tld: isRunningOnEnvironment('production') })
  returnUrl?: string

  @ApiPropertyOptional({
    description: 'The url to redirect to on cancellation',
  })
  @IsOptional()
  @IsUrl({ require_tld: isRunningOnEnvironment('production') })
  cancelUrl?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'If true the user will be redirected to the returnUrl after the payment flow has been completed successfully',
    type: Boolean,
  })
  @ReturnUrlRequired() // See validator above
  redirectToReturnUrlOnSuccess?: boolean
}
