import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsString } from 'class-validator'

@InputType()
export class HealthDirectorateRenewalInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  productId!: string

  @Field(() => String)
  @IsString()
  medCardDrugId!: string

  @Field(() => Int)
  @IsInt()
  medCardDrugCategory!: number
}
