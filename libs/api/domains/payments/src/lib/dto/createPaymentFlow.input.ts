import { Field, InputType, Float } from '@nestjs/graphql'
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
} from 'class-validator'
import { Type } from 'class-transformer'
import { GraphQLJSONObject } from 'graphql-type-json'

import { CreatePaymentFlowInputAvailablePaymentMethodsEnum } from '@island.is/clients/payments'

@InputType('PaymentsCreateChargeInput')
export class ChargeInput {
  @Field(() => String, { description: 'Charge type' })
  @IsString()
  chargeType!: string

  @Field(() => String, { description: 'Charge item code' })
  @IsString()
  chargeItemCode!: string

  @Field(() => Float, { description: 'Quantity of this item' })
  @IsNumber()
  @IsPositive({ message: 'quantity must be greater than 0' })
  quantity!: number

  @Field(() => Float, { nullable: true, description: 'Price of the charge' })
  @IsNumber()
  @IsOptional()
  @IsPositive({ message: 'price must be greater than 0' })
  price?: number
}

@InputType('PaymentsCreateInput')
export class CreatePaymentFlowInput {
  @Field(() => [String], {
    description: 'List of allowed payment methods for this payment flow',
  })
  @IsArray()
  @IsEnum(CreatePaymentFlowInputAvailablePaymentMethodsEnum, { each: true })
  availablePaymentMethods!: CreatePaymentFlowInputAvailablePaymentMethodsEnum[]

  @Field(() => [ChargeInput], {
    description: 'Charges associated with the payment flow',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ChargeInput)
  charges!: ChargeInput[]

  @Field(() => String, {
    description: 'National id of the payer, can be a company or an individual',
  })
  @IsString()
  @Length(10, 10, {
    message: 'payerNationalId must be exactly 10 characters long',
  })
  @Matches(/^\d+$/, {
    message: 'payerNationalId must contain only numeric characters',
  })
  payerNationalId!: string

  @Field(() => String, {
    description: 'Identifier for the organization initiating the payment flow',
  })
  @IsString()
  organisationId!: string

  @Field(() => String, {
    description:
      'URL callback to be called on payment update events like when the user requests to create invoice rather than directly paying',
  })
  @IsString()
  onUpdateUrl!: string

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description:
      'Arbitrary JSON data that will be returned with the onUpdateUrl callback',
  })
  @IsObject()
  @IsOptional()
  metadata?: object

  @Field(() => String, {
    nullable: true,
    description: 'Product title to display to the payer',
  })
  @IsString()
  @IsOptional()
  productTitle?: string

  @Field(() => String, {
    nullable: true,
    description:
      'Optional identifier for an invoice associated with the payment flow',
  })
  @IsString()
  @IsOptional()
  existingInvoiceId?: string

  @Field(() => String, {
    nullable: true,
    description: 'URL to redirect the user to after payment is completed',
  })
  @IsString()
  @IsOptional()
  returnUrl?: string
}
