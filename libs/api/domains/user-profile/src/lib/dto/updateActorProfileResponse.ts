import { Field, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@ObjectType()
export class UpdateActorProfileResponse {
  @Field(() => String, { nullable: false })
  @IsString()
  fromNationalId!: string

  @Field(() => Boolean, { nullable: false })
  @IsBoolean()
  emailNotifications!: boolean
}
