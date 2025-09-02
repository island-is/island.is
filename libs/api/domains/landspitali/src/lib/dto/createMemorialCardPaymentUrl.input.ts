import { Field, InputType, Int } from '@nestjs/graphql'
import { Min, IsInt, IsString, IsEmail, IsOptional } from 'class-validator'

@InputType('WebLandspitaliCreateMemorialCardPaymentUrlInput')
export class CreateMemorialCardPaymentUrlInput {
  @Field(() => String)
  locale = 'is'

  /* Recipient */
  @Field(() => String)
  @IsString()
  recipientName!: string

  @Field(() => String)
  @IsString()
  recipientAddress!: string

  @Field(() => String)
  @IsString()
  recipientPostalCode!: string

  @Field(() => String)
  @IsString()
  recipientPlace!: string

  /* Payer */
  @Field(() => String)
  @IsString()
  payerName!: string

  @Field(() => String)
  @IsEmail()
  payerEmail!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
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

  /* Sender */
  @Field(() => String)
  @IsString()
  senderSignature!: string

  @IsInt()
  @Min(1000)
  @Field(() => Int)
  amountISK!: number

  @Field(() => String)
  @IsString()
  fundChargeItemCode!: string

  @Field(() => String)
  @IsString()
  inMemoryOf!: string
}
