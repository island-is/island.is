import { IsString, } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class IdInput {
  @Field()
  @IsString()
  id!: string

}
