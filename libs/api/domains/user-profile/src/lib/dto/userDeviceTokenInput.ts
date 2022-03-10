import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UserDeviceTokenInput {
  @Field(() => String)
  deviceToken!: string
}
