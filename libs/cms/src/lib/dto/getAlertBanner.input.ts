import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAlertBannerInput {
  @Field()
  @IsString()
  id!: string // Used in the main layout with an explicit id in the input

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
