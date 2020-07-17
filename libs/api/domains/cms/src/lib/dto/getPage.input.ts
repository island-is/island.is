import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetPageInput {
  @Field()
  @IsString()
  slug: string

  @Field()
  @IsString()
  lang: string
}
