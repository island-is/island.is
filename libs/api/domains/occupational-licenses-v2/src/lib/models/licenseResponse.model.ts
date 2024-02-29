import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { License } from './license.model'
import { Link } from './link'

export enum OccupationalLicenseV2LicenseResponseType {
  'HEALTH_DIRECTORATE' = 'health-directorate',
  'DISTRICT_COMMISSIONERS' = 'district-commissioners',
  'EDUCATION' = 'education',
}

registerEnumType(OccupationalLicenseV2LicenseResponseType, {
  name: 'occupationalLicenseV2LicenseResponseType',
})

@ObjectType('OccupationalLicensesV2LicenseResponse')
export class LicenseResponse {
  @Field()
  license!: License

  @Field(() => OccupationalLicenseV2LicenseResponseType)
  type!: OccupationalLicenseV2LicenseResponseType

  @Field(() => [Link], { nullable: true })
  actions?: Array<Link>

  @Field({ nullable: true })
  headerText?: string

  @Field({ nullable: true })
  footerText?: string
}
