import { z } from 'zod'
import * as kennitala from 'kennitala'
import { EMPLOYMENT_STATUS } from '../shared/constants'
import { isValid24HFormatTime, isValidPhoneNumber } from '../utils'
import { YES } from '@island.is/application/core'
import { information } from './messages/information'

const option = z.object({
  value: z.string(),
  label: z.string(),
})

const TimeWithRefine = z
  .string()
  .refine((x) => (x ? isValid24HFormatTime(x) : false), {})

const accidentSchema = z
  .object({
    accidentLocation: option,
    accidentLocationParentGroup: option.optional(),
    didAoshCome: z.string(),
    didPoliceCome: z.string(),
    exactLocation: z.string().min(1).max(100),
    municipality: z.string(),
    date: z.string(),
    time: TimeWithRefine,
    how: z.string().min(1).max(499),
    wasDoing: z.string().min(1).max(499),
    wentWrong: z.string().min(1).max(499),
  })
  .refine(
    (data) => {
      const date = new Date(data.date)
      const now = new Date()

      if (date.toDateString() === now.toDateString()) {
        const hours = parseInt(data.time.slice(0, 2))
        const minutes = parseInt(data.time.slice(2, 4))
        const inputTime = new Date()
        inputTime.setHours(hours, minutes, 0, 0)
        if (inputTime > now) {
          return false
        }
      }
      return true
    },
    {
      path: ['time'],
    },
  )
const basicCompanySchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  address: z.string(),
  name: z.string(),
  numberOfEmployees: z.string(),
  postnumber: z.string(),
})

const companySchema = z
  .object({
    addressOfBranch: z.string().optional(),
    nameOfBranch: z.string().min(1),
    postnumberOfBranch: z.string().optional().nullable(),
    industryClassification: z.string().optional(),
    email: z.string().email(),
    phonenumber: z.string().refine((v) => isValidPhoneNumber(v)),
  })
  .superRefine((data, ctx) => {
    // Validating that both address/postnumber are input or neither
    const hasAddress =
      data.addressOfBranch && data.addressOfBranch.trim() !== ''
    const hasPostnumber = data.postnumberOfBranch

    if (hasAddress || hasPostnumber) {
      if (!hasAddress) {
        ctx.addIssue({
          path: ['addressOfBranch'],
          params: information.labels.company.branchAddressError,
          code: z.ZodIssueCode.custom,
        })
      }
      if (!hasPostnumber) {
        ctx.addIssue({
          path: ['postnumberOfBranch'],
          params: information.labels.company.branchPostnumberError,
          code: z.ZodIssueCode.custom,
        })
      }
    }
  })

const employeeSchema = z
  .object({
    victimsOccupation: option,
    victimsOccupationMajor: option.optional().nullable(),
    victimsOccupationSubMajor: option.optional().nullable(),
    victimsOccupationMinor: option.optional().nullable(),
    victimsOccupationUnit: option.optional().nullable(),
    address: z.string().min(1).max(256),
    employmentStatus: z.string().optional(),
    employmentTime: z.string(),
    employmentRate: z.string().refine(
      (v) => {
        const rateNum = parseInt(v, 10)
        return rateNum > 0 && rateNum <= 100
      },
      {
        message: '1-100%',
      },
    ),
    workhourArrangement: z.string(),
    nationality: z.string(),
    postnumberAndMunicipality: z.string(),
    startTime: TimeWithRefine,
    startOfWorkdayDate: z.string(),
    startDate: z.string(),
    tempEmploymentSSN: z.string().optional(),
    workstation: z.string(),
    nationalField: z.object({
      name: z.string().min(1),
      nationalId: z.string().min(1),
    }),
  })
  .refine(
    (data) => {
      if (data.employmentStatus === EMPLOYMENT_STATUS.TEMP_AGENCY) {
        return (
          data.tempEmploymentSSN &&
          data.tempEmploymentSSN.length !== 0 &&
          kennitala.isValid(data.tempEmploymentSSN)
        )
      }
      return true
    },
    {
      path: ['tempEmploymentSSN'],
    },
  )

// Reusable schema generator
const createCauseAndEffectSchema = (
  fieldKey: string,
  mostSeriousKey: string,
) => {
  return z
    .object({
      [fieldKey]: z
        .record(z.array(option))
        .refine((obj) => Object.values(obj).some((arr) => arr.length > 0)),
      [mostSeriousKey]: z.string().optional().nullable(),
    })
    .refine(
      (data) => {
        // Narrow the type of data[fieldKey]
        const fieldData = data[fieldKey] as
          | Record<string, { value: string; label: string }[]>
          | undefined

        // Safely check if fieldData exists
        if (!fieldData) return false

        // Get total number of option objects across all arrays
        const totalOptions = Object.values(fieldData).reduce(
          (sum, arr) => sum + arr.length,
          0,
        )

        // If there are 2 or more options, the most serious must have a value
        return totalOptions < 2 || (totalOptions >= 2 && data[mostSeriousKey])
      },
      {
        path: [mostSeriousKey], // Error path
      },
    )
}

const circumstancesSchema = createCauseAndEffectSchema(
  'physicalActivities',
  'physicalActivitiesMostSerious',
)

const workDeviationsSchema = createCauseAndEffectSchema(
  'workDeviations',
  'workDeviationsMostSerious',
)

const contactModeOfInjurySchema = createCauseAndEffectSchema(
  'contactModeOfInjury',
  'contactModeOfInjuryMostSerious',
)

const typeOfInjurySchema = createCauseAndEffectSchema(
  'typeOfInjury',
  'typeOfInjuryMostSerious',
)

const partOfBodyInjuredSchema = createCauseAndEffectSchema(
  'partOfBodyInjured',
  'partOfBodyInjuredMostSerious',
)

const absenceSchema = z.string()

const companyLaborProtectionSchema = z.object({
  workhealthAndSafetyOccupation: z.array(z.string()).refine(
    (data) => {
      return data.length > 0
    },
    {
      path: [''],
    },
  ),
})

const projectPurchaseSchema = z
  .object({
    radio: z.string(),
    contractor: z
      .object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      return (
        data.radio !== YES ||
        (data.contractor?.nationalId && data.contractor.name)
      )
    },
    {
      path: [''],
    },
  )

export const WorkAccidentNotificationAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  basicInformation: basicCompanySchema,
  companyInformation: companySchema,
  companyLaborProtection: companyLaborProtectionSchema,
  accident: accidentSchema,
  absence: z.array(absenceSchema),
  employee: z.array(employeeSchema),
  projectPurchase: projectPurchaseSchema,
  circumstances: z.array(circumstancesSchema),
  deviations: z.array(workDeviationsSchema),
  causeOfInjury: z.array(contactModeOfInjurySchema),
  typeOfInjury: z.array(typeOfInjurySchema),
  injuredBodyParts: z.array(partOfBodyInjuredSchema),
  employeeAmount: z.number().min(1),
})

export type WorkAccidentNotificationAnswers = z.TypeOf<
  typeof WorkAccidentNotificationAnswersSchema
>
export type BasicCompanyType = z.TypeOf<typeof basicCompanySchema>
export type CompanyType = z.TypeOf<typeof companySchema>
export type CompanyLaborProtectionType = z.TypeOf<
  typeof companyLaborProtectionSchema
>
export type AccidentType = z.TypeOf<typeof accidentSchema>
export type EmployeeType = z.TypeOf<typeof employeeSchema>
