import { Field, InputType, Int } from '@nestjs/graphql'
import { Min, IsNumber } from 'class-validator'

@InputType()
export class CreateMemorialCardPaymentUrlInput {
  @Field(() => String)
  locale = 'is'

  /* Recipient */
  @Field(() => String)
  recipientName!: string

  @Field(() => String)
  recipientAddress!: string

  @Field(() => String)
  recipientPostalCode!: string

  @Field(() => String)
  recipientPlace!: string

  /* Payer */
  @Field(() => String)
  payerName!: string

  @Field(() => String)
  payerEmail!: string

  @Field(() => String)
  payerNationalId!: string

  @Field(() => String)
  payerAddress!: string

  @Field(() => String)
  payerPostalCode!: string

  @Field(() => String)
  payerPlace!: string

  /* Sender */
  @Field(() => String)
  senderSignature!: string

  @IsNumber()
  @Min(1000)
  @Field(() => Int)
  amountISK!: number

  @Field(() => String)
  chargeItemCode!: string

  @Field(() => String)
  inMemoryOf!: string
}
