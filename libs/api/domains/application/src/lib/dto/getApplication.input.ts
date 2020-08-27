import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetApplicationInput {
  @Field()
  @IsString()
  id: string
}
