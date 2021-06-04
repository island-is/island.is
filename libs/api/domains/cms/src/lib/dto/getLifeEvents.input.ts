import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetLifeEventsInput {
  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
