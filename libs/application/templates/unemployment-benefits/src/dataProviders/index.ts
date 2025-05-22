import { defineTemplateApi } from '@island.is/application/types'

export const WorkMachineLicensesApi = defineTemplateApi({
  action: 'getWorkMachineLicenses',
  externalDataId: 'workMachineLicenses',
})

// export const DrivingLicenseApi = defineTemplateApi({
//   action: 'getDrivingLicense',
//   externalDataId: 'drivingLicense',
// })

export const UnemploymentApi = defineTemplateApi({
  action: 'getEmptyApplication',
  externalDataId: 'unemploymentApplication',
})
