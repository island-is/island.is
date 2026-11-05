import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
  ArrayNotEmpty,
  Length,
  Matches,
  IsPositive,
  ValidateNested,
  IsBoolean,
  IsUrl,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { Type } from 'class-transformer'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { PaymentMethod } from '../../../types'
import { BasePaymentFlowInput } from './basePaymentFlow.input'

const InvoiceReturnUrlRequired = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'invoiceReturnUrlRequired',
      target: (object as { constructor: NewableFunction }).constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const obj = args.object as { invoiceReturnUrl?: string }
          if (value && !obj.invoiceReturnUrl) {
            return false
          }
          return true
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} can only have a value if invoiceReturnUrl is also provided.`
        },
      },
    })
  }
}

export class ExtraDataItem {
  @IsString()
  @ApiProperty({
    description: 'Key',
    type: String,
  })
  name!: string

  @IsString()
  @ApiProperty({
    description: 'Value',
    type: String,
  })
  value!: string
}

export class ChargeInput {
  @IsString()
  @ApiProperty({
    description: 'Charge type',
    type: String,
  })
  chargeType!: string

  @IsString()
  @ApiProperty({
    description: 'Charge item code',
    type: String,
  })
  chargeItemCode!: string

  @IsNumber()
  @IsPositive({ message: 'quantity must be greater than 0' })
  @ApiProperty({
    description: 'Quantity of this item',
    type: Number,
  })
  quantity!: number

  @IsNumber()
  @IsOptional()
  @IsPositive({ message: 'price must be greater than 0' })
  @ApiPropertyOptional({
    description: 'Price of the charge',
    type: Number,
  })
  price?: number

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Reference of the charge',
    type: String,
  })
  reference?: string
}

export class CreatePaymentFlowInput extends BasePaymentFlowInput {
  @ApiPropertyOptional({
    description: 'Payment methods are determined by the charges',
    type: [String],
    example: ['card', 'invoice'],
    enum: PaymentMethod,
    isArray: true,
    deprecated: true,
  })
  @IsArray()
  @IsOptional()
  @IsEnum(PaymentMethod, { each: true })
  availablePaymentMethods?: PaymentMethod[]

  @ApiProperty({
    description: 'Charges associated with the payment flow',
    type: [ChargeInput],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Validate each object in the array
  @Type(() => ChargeInput) // Transform each array item to a Charge instance
  charges!: ChargeInput[]

  @IsString()
  @Length(10, 10, {
    message: 'organisationId must be exactly 10 characters long',
  })
  @Matches(/^\d+$/, {
    message: 'organisationId must contain only numeric characters',
  })
  @ApiProperty({
    description: 'National id for the organization initiating the payment flow',
    type: String,
  })
  organisationId!: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Product title to display to the payer',
    type: String,
  })
  productTitle?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Optional identifier for an invoice associated with the payment flow',
    type: String,
  })
  existingInvoiceId?: string

  @ApiPropertyOptional({
    description: 'The url to redirect to when an invoice is created',
  })
  @IsOptional()
  @IsUrl({ require_tld: isRunningOnEnvironment('production') })
  invoiceReturnUrl?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'If true the user will be redirected to the invoiceReturnUrl after an invoice has been created',
    type: Boolean,
  })
  @InvoiceReturnUrlRequired()
  redirectOnInvoiceCreation?: boolean

  @ApiPropertyOptional({
    description:
      'Define key-value pairs of extra data that should be included when creating the FJS charge for the payment, example: car license plate, house address etc.',
    type: [ExtraDataItem],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExtraDataItem)
  extraData?: ExtraDataItem[]

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Id that becomes the subject of the FJS charge item, used to reference where it originated from',
    type: String,
  })
  chargeItemSubjectId?: string
}
