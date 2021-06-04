import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class AssignApplicationInput {
  @Field(() => String)
  @IsString()
  token!: string
}
