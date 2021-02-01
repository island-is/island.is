import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateHelpdeskInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  email?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string
}
