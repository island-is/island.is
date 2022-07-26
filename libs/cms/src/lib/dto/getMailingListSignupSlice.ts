import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetMailingListSignupSliceInput {
  @Field()
  @IsString()
  id!: string
}
