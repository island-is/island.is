import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

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

  @Field(() => String)
  @IsString()
  medCardDrugCategory!: string
}
