import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthPasskeyRegistrationVerification')
export class PasskeyRegistrationVerification {
  @Field(() => Boolean)
  verified!: boolean
}
