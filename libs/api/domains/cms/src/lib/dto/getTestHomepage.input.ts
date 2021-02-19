import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetTestHomepageInput {
  @Field()
  @IsString()
  lang: string
}
