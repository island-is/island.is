import { Field, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateLicense } from './healthDirectorateLicense.model'
import { EducationLicense } from './educationLicense.model'
import { DistrictCommissionersLicense } from './districtCommissionersLicense.model'

@ObjectType('OccupationalLicensesV2Response')
export class LicensesV2Response {
  @Field(() => [HealthDirectorateLicense])
  health?: Array<HealthDirectorateLicense>

  @Field(() => [EducationLicense])
  education?: Array<EducationLicense>

  @Field(() => [DistrictCommissionersLicense])
  districtCommissioners?: Array<DistrictCommissionersLicense>
}
