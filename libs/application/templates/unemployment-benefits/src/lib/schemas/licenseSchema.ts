import { YES } from '@island.is/application/core'
import { z } from 'zod'

export const licenseSchema = z
  .object({
    hasDrivingLicense: z.array(z.string()).optional(),
    drivingLicenseTypes: z.array(z.string()).optional(),
    hasHeavyMachineryLicense: z.array(z.string()).optional(),
    heavyMachineryLicensesTypes: z.array(z.string()).optional().nullable(),
  })
  .refine(
    ({ hasDrivingLicense, drivingLicenseTypes }) => {
      if (
        hasDrivingLicense &&
        hasDrivingLicense.length > 0 &&
        hasDrivingLicense[0] === YES
      ) {
        return (
          drivingLicenseTypes !== undefined && drivingLicenseTypes.length > 0
        )
      }

      return true
    },
    { path: ['drivingLicenseTypes'] },
  )
  .refine(
    ({ hasHeavyMachineryLicense, heavyMachineryLicensesTypes }) => {
      if (
        hasHeavyMachineryLicense &&
        hasHeavyMachineryLicense.length > 0 &&
        hasHeavyMachineryLicense[0] === YES
      ) {
        return (
          heavyMachineryLicensesTypes && heavyMachineryLicensesTypes.length > 0
        )
      }

      return true
    },
    { path: ['heavyMachineryLicensesTypes'] },
  )
