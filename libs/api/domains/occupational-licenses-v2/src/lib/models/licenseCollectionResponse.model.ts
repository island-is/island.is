import { Field, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateLicense } from './healthDirectorateLicense.model'
import { EducationLicense } from './educationLicense.model'
import { DistrictCommissionersLicense } from './districtCommissionersLicense.model'

@ObjectType('OccupationalLicensesV2Collection')
export class LicensesCollection {
  @Field(() => [HealthDirectorateLicense], { nullable: true })
  health?: Array<HealthDirectorateLicense>

  @Field(() => [EducationLicense], { nullable: true })
  education?: Array<EducationLicense>

  @Field(() => [DistrictCommissionersLicense], { nullable: true })
  districtCommissioners?: Array<DistrictCommissionersLicense>
}
