import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAnchorPageInput {
  @Field()
  @IsString()
  slug!: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
