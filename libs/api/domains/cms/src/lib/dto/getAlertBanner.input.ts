import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAlertBannerInput {
  @Field()
  @IsString()
  id: string

  @Field()
  @IsString()
  lang: string
}
