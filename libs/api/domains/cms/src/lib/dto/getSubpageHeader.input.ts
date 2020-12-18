import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetSubpageHeaderInput {
  @Field()
  @IsString()
  id: string

  @Field()
  @IsString()
  lang: string
}
