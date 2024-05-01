import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthRegistrationOptionsRp')
export class RegistrationOptionsRp {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string
}

@ObjectType('AuthRegistrationOptionsUser')
export class RegistrationOptionsUser {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  displayName!: string
}

@ObjectType('AuthRegistrationOptionsPublicKeyCredentialOption')
export class RegistrationOptionsPublicKeyCredentialOption {
  @Field(() => Number)
  alg!: number

  @Field(() => String)
  type!: string
}

@ObjectType('AuthRegistrationOptionsAuthenticatorSelection')
export class RegistrationOptionsAuthenticatorSelection {
  @Field(() => String)
  residentKey!: string

  @Field(() => String)
  userVerification!: string

  @Field(() => String, { nullable: true })
  requireResidentKey?: string
}

@ObjectType('AuthRegistrationOptionsExtensions')
export class RegistrationOptionsExtensions {
  @Field(() => Boolean)
  credProps!: boolean
}

@ObjectType('AuthRegistrationOptionsPublicKeyCredentialDescriptorJSON')
export class RegistrationOptionsPublicKeyCredentialDescriptorJSON {
  @Field(() => String)
  id!: string

  @Field(() => String)
  type!: string

  @Field(() => [String])
  transports!: string[]
}

@ObjectType('AuthPasskeyRegistrationOptions')
export class PasskeyRegistrationOptions {
  @Field(() => String)
  challenge!: string

  @Field(() => RegistrationOptionsRp)
  rp!: RegistrationOptionsRp

  @Field(() => RegistrationOptionsUser)
  user!: RegistrationOptionsUser

  @Field(() => [RegistrationOptionsPublicKeyCredentialOption])
  pubKeyCredParams!: RegistrationOptionsPublicKeyCredentialOption[]

  @Field(() => Number)
  timeout!: number

  @Field(() => String)
  attestation!: string

  @Field(() => [RegistrationOptionsPublicKeyCredentialDescriptorJSON])
  excludeCredentials!: RegistrationOptionsPublicKeyCredentialDescriptorJSON[]

  @Field(() => RegistrationOptionsAuthenticatorSelection)
  authenticatorSelection!: RegistrationOptionsAuthenticatorSelection

  @Field(() => RegistrationOptionsExtensions)
  extensions!: RegistrationOptionsExtensions
}
