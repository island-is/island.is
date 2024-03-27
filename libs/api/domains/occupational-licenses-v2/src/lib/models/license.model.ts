import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { GenericField } from './genericField.model'
import { StatusV2 } from './licenseStatus.model'
import { LicenseType } from './licenseType.model'

@ObjectType('OccupationalLicenseV2')
export class License {
  @Field()
  licenseId!: string

  @Field()
  licenseNumber!: string

  @Field(() => LicenseType)
  type!: LicenseType

  @Field({ nullable: true })
  legalEntityId?: string

  @Field({ nullable: true })
  issuer?: string

  @Field({ nullable: true })
  issuerTitle?: string

  @Field()
  profession!: string

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

  @Field(() => StatusV2)
  status!: StatusV2

  @Field(() => [GenericField], { nullable: true })
  genericFields?: Array<GenericField>
}
