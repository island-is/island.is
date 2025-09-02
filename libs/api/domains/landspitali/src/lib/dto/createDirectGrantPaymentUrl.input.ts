import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator'

@InputType('WebLandspitaliCreateDirectGrantPaymentUrlInput')
export class CreateDirectGrantPaymentUrlInput {
  @Field(() => String)
  locale = 'is'

  @Field(() => String, { nullable: true })
  @IsOptional()
  payerNationalId?: string

  @Field(() => String)
  @IsString()
  payerName!: string

  @Field(() => String)
  @IsEmail()
  payerEmail!: string

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
  grantChargeItemCode!: string

  @Field(() => String)
  @IsString()
  project!: string

  @IsInt()
  @Min(1000)
  @Field(() => Int)
  amountISK!: number
}
