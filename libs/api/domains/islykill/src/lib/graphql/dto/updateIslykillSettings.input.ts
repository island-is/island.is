import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateIslykillSettingsInput {
  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String)
  @IsString()
  mobile!: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  canNudge?: boolean
}
