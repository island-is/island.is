import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthRegistrationOptionsRp')
export class RegistrationOptionsRp {
  @Field(() => String, { nullable: true })
  id?: string

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
  @Field(() => String, { nullable: true })
  authenticatorAttachment?: string

  @Field(() => Boolean, { nullable: true })
  requireResidentKey?: boolean

  @Field(() => String, { nullable: true })
  residentKey?: string

  @Field(() => String, { nullable: true })
  userVerification?: string
}

@ObjectType('AuthRegistrationOptionsExtensions')
export class RegistrationOptionsExtensions {
  @Field(() => String, { nullable: true })
  appid?: string

  @Field(() => Boolean, { nullable: true })
  credProps?: boolean

  @Field(() => Boolean, { nullable: true })
  hmacCreateSecret?: boolean
}

@ObjectType('AuthRegistrationOptionsPublicKeyCredentialDescriptorJSON')
export class RegistrationOptionsPublicKeyCredentialDescriptorJSON {
  @Field(() => String)
  id!: string

  @Field(() => String)
  type!: 'public-key'

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

  @Field(() => Number, { nullable: true })
  timeout?: number

  @Field(() => String, { nullable: true })
  attestation?: string

  @Field(() => [RegistrationOptionsPublicKeyCredentialDescriptorJSON], {
    nullable: true,
  })
  excludeCredentials?: RegistrationOptionsPublicKeyCredentialDescriptorJSON[]

  @Field(() => RegistrationOptionsAuthenticatorSelection, { nullable: true })
  authenticatorSelection?: RegistrationOptionsAuthenticatorSelection

  @Field(() => RegistrationOptionsExtensions, { nullable: true })
  extensions?: RegistrationOptionsExtensions
}
