import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GenericFormInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsString()
  name!: string

  @Field()
  @IsString()
  email!: string

  @Field()
  @IsString()
  message!: string

  @Field({ nullable: true })
  recipientFormFieldDeciderValue?: string
}
