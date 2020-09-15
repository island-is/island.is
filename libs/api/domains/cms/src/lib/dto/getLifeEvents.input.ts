import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetLifeEventsInput {
  @Field()
  @IsString()
  lang: string
}
