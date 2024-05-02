import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthPasskeyAuthenticationObjectResponse')
export class PasskeyAuthenticationObjectResponse {
  @Field(() => String)
  authenticatorData!: string

  @Field(() => String)
  clientDataJSON!: string

  @Field(() => String)
  signature!: string

  @Field(() => String)
  userHandle!: string
}

@InputType('AuthPasskeyAuthenticationObjectCredentialPropertiesOutput')
export class PasskeyAuthenticationObjectCredentialPropertiesOutput {
  @Field(() => Boolean)
  rk!: boolean
}

@InputType('AuthPasskeyAuthenticationObjectExtensionsClientOutputs')
export class PasskeyAuthenticationObjectExtensionsClientOutputs {
  @Field(() => Boolean, { nullable: true })
  appid?: boolean

  @Field(() => PasskeyAuthenticationObjectCredentialPropertiesOutput, {
    nullable: true,
  })
  credProps?: PasskeyAuthenticationObjectCredentialPropertiesOutput

  @Field(() => Boolean, { nullable: true })
  hmacCreateSecret?: boolean
}

@InputType('AuthPasskeyAuthenticationObject')
export class PasskeyAuthenticationObject {
  @Field(() => String)
  id!: string

  @Field(() => String)
  rawId!: string

  @Field(() => PasskeyAuthenticationObjectResponse)
  response!: PasskeyAuthenticationObjectResponse

  @Field(() => String)
  type!: string

  @Field(() => PasskeyAuthenticationObjectExtensionsClientOutputs)
  clientExtensionResults!: PasskeyAuthenticationObjectExtensionsClientOutputs

  @Field(() => String)
  authenticatorAttachment!: string
}
