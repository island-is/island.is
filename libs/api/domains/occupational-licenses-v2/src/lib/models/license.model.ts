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
}

registerEnumType(OccupationalLicenseStatusV2, {
  name: 'OccupationalLicenseStatusV2',
})

export enum OccupationalLicenseStatus {
  VALID = 'valid',
  ERROR = 'error',
  LIMITED = 'limited',
}

@InterfaceType('OccupationalLicenseV2', {
  resolveType(license) {
    if (license.downloadURI) {
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

  @Field({ nullable: true })
  title?: string

  @Field(() => OccupationalLicenseStatusV2)
  status!: OccupationalLicenseStatusV2
}
