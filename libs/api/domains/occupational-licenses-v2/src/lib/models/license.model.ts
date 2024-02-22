import {
  Field,
  registerEnumType,
  GraphQLISODateTime,
  InterfaceType,
} from '@nestjs/graphql'

export enum OccupationalLicenseStatusV2 {
  VALID = 'valid',
  ERROR = 'error',
  LIMITED = 'limited',
  IN_PROGRESS = 'in-progress',
  UNKNOWN = 'unknown',
}

registerEnumType(OccupationalLicenseStatusV2, {
  name: 'OccupationalLicenseStatusV2',
})

@InterfaceType('OccupationalLicenseV2', {
  resolveType(license) {
    if (license.downloadUrl) {
      return 'OccupationalLicensesV2EducationLicense'
    }
    if (license.legalEntityId) {
      return 'OccupationalLicensesV2HealthDirectorateLicense'
    }
    return 'OccupationalLicensesV2DistrictCommissionersLicense'
  },
})
export abstract class License {
  @Field()
  licenseId!: string

  @Field()
  licenseNumber!: string

  @Field()
  issuer!: string

  @Field()
  profession!: string

  @Field({ nullable: true })
  type?: string

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

  @Field(() => OccupationalLicenseStatusV2)
  status!: OccupationalLicenseStatusV2
}
