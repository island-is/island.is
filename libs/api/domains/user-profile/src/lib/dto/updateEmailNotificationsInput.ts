import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class UpdateEmailNotificationsInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean
}
