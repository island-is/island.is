import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsArray,
  IsString,
  IsNumber,
  IsObject,
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
  IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'

import { PaymentMethod } from '../../../types'

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
}

export class CreatePaymentFlowInput {
  @ApiProperty({
    description: 'List of allowed payment methods for this payment flow',
    type: [String],
    example: ['card', 'invoice'],
    enum: PaymentMethod,
    isArray: true,
  })
  @IsArray()
  @IsEnum(PaymentMethod, { each: true })
  availablePaymentMethods!: PaymentMethod[]

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
    description: 'The url to redirect to on successful payment',
  })
  @IsOptional()
  @IsUrl()
  returnUrl?: string

  @ApiPropertyOptional({
    description: 'The url to redirect to on cancellation',
  })
  @IsOptional()
  @IsUrl()
  cancelUrl?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'If true the user will be redirected to the returnUrl after the payment flow has been completed successfully',
    type: Boolean,
  })
  @ReturnUrlRequired() // See validator below
  redirectToReturnUrlOnSuccess?: boolean

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

function ReturnUrlRequired(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'returnUrlRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any
          if (value && !object.returnUrl) {
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
