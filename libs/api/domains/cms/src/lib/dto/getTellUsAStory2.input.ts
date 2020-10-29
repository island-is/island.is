import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetTellUsAStoryInput {
  @Field()
  @IsString()
  lang: string
}
