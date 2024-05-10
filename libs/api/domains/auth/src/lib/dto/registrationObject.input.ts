import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthExtensionCredProps')
export class ExtensionCredProps {
  @Field(() => Boolean)
  rk!: boolean
}

@InputType('AuthPasskeyRegistrationObjectClientExtensionResults')
export class PasskeyRegistrationObjectClientExtensionResults {
  @Field(() => ExtensionCredProps, { nullable: true })
  credProps?: ExtensionCredProps
}

@InputType('AuthPasskeyRegistrationObjectResponse')
export class PasskeyRegistrationObjectResponse {
  @Field(() => String)
  attestationObject!: string

  @Field(() => String)
  clientDataJSON!: string

  @Field(() => [String])
  transports!: string[]

  @Field(() => Number)
  publicKeyAlgorithm!: number

  @Field(() => String)
  publicKey!: string

  @Field(() => String)
  authenticatorData!: string
}

@InputType('AuthPasskeyRegistrationObject')
export class PasskeyRegistrationObject {
  @Field(() => String)
  id!: string

  @Field(() => String)
  rawId!: string

  @Field(() => PasskeyRegistrationObjectResponse)
  response!: PasskeyRegistrationObjectResponse

  @Field(() => String)
  type!: string

  @Field(() => String)
  authenticatorAttachment!: string

  @Field(() => PasskeyRegistrationObjectClientExtensionResults)
  clientExtensionResults!: PasskeyRegistrationObjectClientExtensionResults
}
