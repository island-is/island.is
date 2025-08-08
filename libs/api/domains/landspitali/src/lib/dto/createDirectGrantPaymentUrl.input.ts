import { Field, InputType, Int } from '@nestjs/graphql'
import { Locale } from '@island.is/shared/types'
import { IsNumber, Min } from 'class-validator'

@InputType()
export class CreateDirectGrantPaymentUrlInput {
  @Field(() => String)
  locale: Locale = 'is'

  @Field(() => String)
  payerNationalId!: string

  @Field(() => String)
  payerName!: string

  @Field(() => String)
  payerAddress!: string

  @Field(() => String)
  payerPostalCode!: string

  @Field(() => String)
  payerPlace!: string

  @Field(() => String)
  payerGrantExplanation!: string

  @Field(() => String)
  grant!: string

  @Field(() => String)
  project!: string

  @IsNumber()
  @Min(1000)
  @Field(() => Int)
  amountISK!: number
}
