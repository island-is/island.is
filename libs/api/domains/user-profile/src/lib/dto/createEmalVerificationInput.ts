import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CreateEmailVerificationInput {
  @Field(() => String)
  @IsString()
  email!: string
}
