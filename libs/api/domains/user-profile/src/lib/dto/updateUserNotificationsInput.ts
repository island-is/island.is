import { Field, ID, InputType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@InputType()
export class UpdateUserNotificationsInput {

  @Field(() => ID)
  @IsString()
  id!: string


  @Field(() => Boolean)
  @IsBoolean()
  isEnabled!: boolean
}
