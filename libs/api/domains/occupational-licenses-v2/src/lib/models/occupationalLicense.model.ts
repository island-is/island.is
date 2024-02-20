import {
  ObjectType,
  Field,
  registerEnumType,
  GraphQLISODateTime,
  InterfaceType,
} from '@nestjs/graphql'

export enum OccupationalLicenseStatusV2 {
  VALID = 'valid',
  ERROR = 'error',
  LIMITED = 'limited',
}

registerEnumType(OccupationalLicenseStatusV2, {
  name: 'OccupationalLicenseStatusV2',
})

export enum OccupationalLicenseStatus {
  VALID = 'valid',
  ERROR = 'error',
  LIMITED = 'limited',
}

@InterfaceType('OccupationalLicenseV2')
export abstract class OccupationalLicenseV2 {
  @Field()
  licenseId!: string

  @Field()
  issuer!: string

  @Field()
  profession!: string

  @Field()
  type!: string

  @Field({ nullable: true })
  licenseHolderName?: string

  @Field({ nullable: true })
  licenseHolderNationalId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateOfBirth?: Date

  @Field(() => GraphQLISODateTime)
  validFrom!: Date

  @Field(() => OccupationalLicenseStatusV2)
  status!: OccupationalLicenseStatusV2
}
