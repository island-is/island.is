import { Field, InputType, Int } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import type {
  DirectGrantPaymentFlowMetadata,
  MemorialCardPaymentFlowMetadata,
} from '../types'

@InputType('WebLandspitaliMemorialCardPaymentConfirmationInput')
export class MemorialCardPaymentConfirmationInput
  implements Omit<MemorialCardPaymentFlowMetadata, 'landspitaliPaymentType'>
{
  @Field(() => Int)
  amountISK!: number

  @Field(() => String)
  @IsString()
  fundChargeItemCode!: string

  @Field(() => String)
  @IsString()
  payerAddress!: string

  @Field(() => String)
  @IsString()
  payerName!: string

  @Field(() => String)
  @IsString()
  payerEmail!: string

  @Field(() => String, { nullable: true })
  payerNationalId?: string

  @Field(() => String)
  @IsString()
  payerPostalCode!: string

  @Field(() => String)
  @IsString()
  payerPlace!: string

  @Field(() => String)
  @IsString()
  recipientAddress!: string

  @Field(() => String)
  @IsString()
  recipientName!: string

  @Field(() => String)
  @IsString()
  recipientPlace!: string

  @Field(() => String)
  @IsString()
  recipientPostalCode!: string

  @Field(() => String)
  @IsString()
  senderSignature!: string

  @Field(() => String)
  @IsString()
  inMemoryOf!: string

  @Field(() => String)
  @IsString()
  validationSecret!: string
}

@InputType('WebLandspitaliDirectGrantPaymentConfirmationInput')
export class DirectGrantPaymentConfirmationInput
  implements Omit<DirectGrantPaymentFlowMetadata, 'landspitaliPaymentType'>
{
  @Field(() => Int)
  amountISK!: number

  @Field(() => String)
  @IsString()
  grantChargeItemCode!: string

  @Field(() => String)
  @IsString()
  project!: string

  @Field(() => String)
  @IsString()
  payerName!: string

  @Field(() => String)
  @IsString()
  payerEmail!: string

  @Field(() => String, { nullable: true })
  payerNationalId?: string

  @Field(() => String)
  @IsString()
  payerAddress!: string

  @Field(() => String)
  @IsString()
  payerPostalCode!: string

  @Field(() => String)
  @IsString()
  payerPlace!: string

  @Field(() => String)
  @IsString()
  payerGrantExplanation!: string

  @Field(() => String)
  @IsString()
  validationSecret!: string
}
