import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  registerDecorator,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

import { BasePaymentFlowInput } from './basePaymentFlow.input'

const UniquePayIds = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'uniquePayIds',
      target: (object as { constructor: NewableFunction }).constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (!Array.isArray(value)) {
            return false
          }
          const payIds = value.map((debt) => (debt as DebtInput)?.payId)
          return new Set(payIds).size === payIds.length
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not contain the same payId more than once.`
        },
      },
    })
  }
}

export class DebtInput {
  @IsString()
  @IsNotEmpty({ message: 'payId cannot be empty' })
  @ApiProperty({
    description: 'The FJS payId of the debt',
    type: String,
  })
  payId!: string

  @IsInt()
  @IsPositive({ message: 'amount must be greater than 0' })
  @ApiProperty({
    description:
      'Amount to pay towards the debt, in whole ISK. Can be less than the full debt.',
    type: Number,
    example: 10000,
  })
  amount!: number

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Optional label for the debt, for display only',
    type: String,
    maxLength: 255,
  })
  label?: string
}

export class CreateDebtPaymentFlowInput extends BasePaymentFlowInput {
  @ApiProperty({
    description:
      'Debts to pay, and how much to pay towards each. Fjársýslan decides whether they can be paid.',
    type: [DebtInput],
    minItems: 1,
  })
  @IsArray()
  @ArrayNotEmpty()
  @UniquePayIds()
  @ValidateNested({ each: true })
  @Type(() => DebtInput)
  debts!: DebtInput[]
}
