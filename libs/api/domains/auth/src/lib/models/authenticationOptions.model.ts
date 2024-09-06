import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthPasskeyAuthenticationOptionsCredentials')
export class PasskeyAuthenticationOptionsCredentials {
  @Field(() => String)
  id!: string

  @Field(() => String)
  type!: string

  @Field(() => [String])
  transports!: string[]
}

@ObjectType('AuthPasskeyAuthenticationOptions')
export class PasskeyAuthenticationOptions {
  @Field(() => String)
  rpId!: string

  @Field(() => String)
  challenge!: string

  @Field(() => [PasskeyAuthenticationOptionsCredentials])
  allowCredentials!: PasskeyAuthenticationOptionsCredentials[]

  @Field(() => Number)
  timeout!: number

  @Field(() => String)
  userVerification!: string
}
