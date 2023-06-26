import { Field, InputType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { Locale } from '../types/locales.enum'
import { DataStatus } from '../types/dataStatus.enum'

@InputType()
export class CreateUserProfileInput {
  @Field(() => String, { nullable: true })
  mobilePhoneNumber?: string

  @Field(() => String, { nullable: true })
  locale?: Locale

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => Boolean, { nullable: true })
  documentNotifications?: boolean

  @Field(() => String, { nullable: true })
  @IsEnum(DataStatus)
  emailStatus?: DataStatus

  @Field(() => String, { nullable: true })
  @IsEnum(DataStatus)
  mobileStatus?: DataStatus

  @Field(() => String, { nullable: true })
  emailCode?: string

  @Field(() => String, { nullable: true })
  smsCode?: string

  // Temporary merge with islyklar service
  @Field(() => Boolean, { nullable: true })
  canNudge?: boolean
}
