import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional } from 'class-validator'

@InputType()
export class CreateIslykillSettingsInput {
  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  mobile?: string
}
