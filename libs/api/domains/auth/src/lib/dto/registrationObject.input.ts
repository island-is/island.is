import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthExtensionCredProps')
export class ExtensionCredProps {
  @Field(() => Boolean, { nullable: true })
  rk?: boolean
}

@InputType('AuthPasskeyRegistrationObjectClientExtensionResults')
export class PasskeyRegistrationObjectClientExtensionResults {
  @Field(() => Boolean, { nullable: true })
  appid?: boolean

  @Field(() => ExtensionCredProps, { nullable: true })
  credProps?: ExtensionCredProps

  @Field(() => Boolean, { nullable: true })
  hmacCreateSecret?: boolean
}

@InputType('AuthPasskeyRegistrationObjectResponse')
export class PasskeyRegistrationObjectResponse {
  @Field()
  attestationObject!: string

  @Field(() => String)
  clientDataJSON!: string

  @Field(() => [String], { nullable: true })
  transports?: string[]

  @Field(() => Number, { nullable: true })
  publicKeyAlgorithm?: number

  @Field(() => String, { nullable: true })
  publicKey?: string

  @Field(() => String, { nullable: true })
  authenticatorData?: string
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

  @Field(() => PasskeyRegistrationObjectClientExtensionResults)
  clientExtensionResults!: PasskeyRegistrationObjectClientExtensionResults

  @Field(() => String, { nullable: true })
  authenticatorAttachment?: string
}
