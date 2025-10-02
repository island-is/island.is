import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { GenericField } from './genericField.model'
import { Status } from './licenseStatus.model'
import { LicenseType } from './licenseType.model'

@ObjectType('OccupationalLicense')
export class License {
  @Field(() => ID)
  cacheId!: string

  @Field()
  licenseId!: string

  @Field(() => LicenseType)
  type!: LicenseType

  @Field({ nullable: true })
  licenseNumber?: string

  @Field({ nullable: true })
  legalEntityId?: string

  @Field({ nullable: true })
  issuer?: string

  @Field({ nullable: true })
  issuerTitle?: string

  @Field({ nullable: true })
  profession?: string

  @Field({ nullable: true })
  permit?: string

  @Field({ nullable: true })
  licenseHolderName?: string

  @Field({ nullable: true })
  licenseHolderNationalId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateOfBirth?: Date

  @Field(() => GraphQLISODateTime)
  validFrom!: Date

  @Field({ nullable: true })
  title?: string

  @Field(() => Status)
  status!: Status

  @Field(() => [GenericField], { nullable: true })
  genericFields?: Array<GenericField>
}
