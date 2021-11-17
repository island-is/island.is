import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional } from 'class-validator'

@InputType()
export class UpdateIslykillSettingsInput {
  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  mobile?: string
}
