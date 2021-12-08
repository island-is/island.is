import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class UserDeviceTokenInput {
  @Field(() => String)
  @IsString()
  deviceToken!: string
}
