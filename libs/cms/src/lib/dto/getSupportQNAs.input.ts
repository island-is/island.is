import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetSupportQNAsInput {
  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
