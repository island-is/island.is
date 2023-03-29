import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminApplicationBasicInfo')
export class ApplicationBasicInfo {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  applicationSecret!: string

  @Field(() => String)
  idsURL!: string

  @Field(() => String)
  oAuthAuthorizationUrl!: string

  @Field(() => String)
  deviceAuthorizationUrl!: string

  @Field(() => String)
  oAuthTokenUrl!: string

  @Field(() => String)
  oAuthUserInfoUrl!: string

  @Field(() => String)
  openIdConfiguration!: string

  @Field(() => String)
  jsonWebKeySet!: string
}
