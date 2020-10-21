import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator'
import { Locale } from '../types/locales.enum'

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
  @IsEnum(Locale)
  locale?: Locale

  @Field(() => String)
  @IsEmail()
  @IsOptional()
  email?: string
}
