import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@InputType()
export class Address {
  @Field()
  @IsString()
  streetAddress!: string

  @Field()
  @IsString()
  city!: string

  @Field()
  @IsString()
  postalCode!: string
}

@InputType()
export class IdentityData {
  @Field()
  @IsString()
  nationalId!: string

  @Field()
  @IsString()
  name!: string

  @CacheField(() => Address)
  address!: Address
}

@InputType()
export class UserProfileData {
  @Field()
  @IsString()
  email!: string

  @Field()
  @IsString()
  mobilePhoneNumber!: string
}

@InputType()
export class RequestCorrectionOnMortgageCertificateInput {
  @Field()
  @IsString()
  propertyNumber!: string

  @CacheField(() => IdentityData)
  identityData!: IdentityData

  @CacheField(() => UserProfileData)
  userProfileData!: UserProfileData
}
