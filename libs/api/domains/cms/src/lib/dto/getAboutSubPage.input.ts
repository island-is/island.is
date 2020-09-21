import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAboutSubPageInput {
  @Field()
  @IsString()
  lang: string

  @Field()
  @IsString()
  slug: string
}
