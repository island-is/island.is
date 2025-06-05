import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsBoolean } from 'class-validator'

@InputType()
export class DeleteIslykillValueInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  mobilePhoneNumber?: boolean

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  email?: boolean
}
