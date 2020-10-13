import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateUserProfileInput {
  //Pending AuthGuards
  @Field(() => String)
  @IsString()
  nationalId!: string

  @Field(() => String)
  @IsString()
  @IsOptional()
  mobilePhoneNumber?: string

  @Field(() => String)
  @IsString()
  @IsOptional()
  locale?: string

  @Field(() => String)
  @IsString()
  @IsOptional()
  email?: string

  @Field(() => String)
  @IsString()
  @IsOptional()
  profileImageUrl?: string
}
