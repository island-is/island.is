import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CreateUserDeviceTokenInput {
  @Field(() => String)
  @IsString()
  deviceToken!: string
}
