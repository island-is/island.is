import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'

@InputType()
export class UpdateUserProfileInput {
  //Pendig AuthGuards
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
