import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@InputType('UserProfileUpdateActorProfileInput')
export class UpdateActorProfileInput {
  @Field(() => String)
  @IsString()
  fromNationalId!: string

  @Field(() => Boolean)
  @IsBoolean()
  emailNotifications!: boolean
}
