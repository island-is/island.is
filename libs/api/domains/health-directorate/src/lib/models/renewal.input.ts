import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class HealthDirectorateRenewalInput {
  @Field(() => String)
  id!: string

  @Field(() => String)
  @IsString()
  prescribedItemId!: string

  @Field(() => String)
  @IsString()
  medCardDrugId!: string

  @Field(() => String)
  @IsString()
  medCardDrugCategory!: string
}
