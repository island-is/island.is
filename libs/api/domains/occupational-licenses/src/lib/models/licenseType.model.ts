import { registerEnumType } from '@nestjs/graphql'

export enum LicenseType {
  'HEALTH_DIRECTORATE' = 'health-directorate',
  'DISTRICT_COMMISSIONERS' = 'district-commissioners',
  'EDUCATION' = 'education',
}

registerEnumType(LicenseType, {
  name: 'occupationalLicenseLicenseType',
})
