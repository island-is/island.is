import { Field, InputType } from '@nestjs/graphql'

import { IsString } from 'class-validator'
//TODO REMOVE for proper authentication
@InputType()
export class GetMyInfoInput {
  @Field()
  @IsString()
  nationalId!: string
}
