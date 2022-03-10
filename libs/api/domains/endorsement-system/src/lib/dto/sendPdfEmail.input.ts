import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsUUID } from 'class-validator'

@InputType()
export class sendPdfEmailInput {
  @Field()
  @IsUUID(4)
  listId!: string
  @Field()
  @IsEmail()
  emailAddress!: string
}
