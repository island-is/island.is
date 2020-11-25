import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAboutSubPageInput {
  @Field()
  @IsString()
  url: string

  @Field()
  @IsString()
  lang: string
}
