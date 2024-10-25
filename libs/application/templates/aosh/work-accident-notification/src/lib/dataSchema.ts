import { z } from 'zod'
import * as kennitala from 'kennitala'
import { YES } from '@island.is/application/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) return false
  const hours = parseInt(value.slice(0, 2))
  const minutes = parseInt(value.slice(2, 4))
  if (hours > 23) return false
  if (minutes > 59) return false
  return true
}

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const TimeWithRefine = z
  .string()
  .refine((x) => (x ? isValid24HFormatTime(x) : false), {})

const option = z.object({
  value: z.string(),
  label: z.string(),
})

const accidentSchema = z.object({
  accidentLocation: option,
  accidentLocationParentGroup: option.optional(),
  didAoshCome: z.string(),
  didPoliceCome: z.string(),
  exactLocation: z.string(),
  municipality: z.string(),
  date: z.string().refine(
    (dateStr) => {
      const date = new Date(dateStr)
      const minDate = new Date('2020-01-01')
      return date >= minDate
    },
    {
      message: 'Date must not be before 1.1.2020', // TODO(balli) translate!
    },
  ),
  time: TimeWithRefine,
  how: z.string().min(1), // TODO(balli) add some max to these ?? here or in the component
  wasDoing: z.string().min(1),
  wentWrong: z.string().min(1),
})

const companySchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  address: z.string(),
  addressOfBranch: z.string().optional(),
  name: z.string(),
  nameOfBranch: z.string(),
  numberOfEmployees: z.string(),
  postnumber: z.string(),
  postnumberOfBranch: z.string().optional(),
  industryClassification: z.string().optional(),
  email: z.string().email(),
  phonenumber: z.string().refine((v) => isValidPhoneNumber(v)),
})

const employeeSchema = z
  .object({
    victimsOccupation: option,
    victimsOccupationMajor: option.optional(),
    victimsOccupationSubMajor: option.optional(),
    victimsOccupationMinor: option.optional(),
    victimsOccupationUnit: option.optional(),
    address: z.string().min(1).max(256),
    employmentStatus: z.string().optional(),
    employmentTime: z.string(),
    employmentRate: z.string(),
    workhourArrangement: z.string(),
    nationality: z.string(),
    postnumberAndMunicipality: z.string(),
    startTime: TimeWithRefine,
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
      // If employmentStatus is '4', tempEmploymentSSN must be valid
      if (data.employmentStatus === '4') {
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
  .refine(
    (data) => {
      const rateNum = parseInt(data.employmentRate, 10)
      return rateNum > 0 && rateNum <= 100
    },
    {
      message: '1%-100%',
      path: ['employmentRate'],
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
        .refine((obj) => Object.values(obj).some((arr) => arr.length > 0), {
          message: 'At least one option has to be chosen',
        }),
      [mostSeriousKey]: z.string().optional(),
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
        message:
          'If more than one option is chosen, you must specify the most serious one', // TODO(balli) Translate
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
      message: 'At least one option must be chosen',
      path: [''], // Error path
    },
  ),
})

const projectPurchaseSchema = z
  .object({
    radio: z.string(),
    nationalId: z.string().optional(),
    name: z.string().optional(),
  })
  .refine((data) => data.radio !== YES || (data.name && data.name.length > 0), {
    path: ['name'], // Focuses on the 'name' field
  })
  .refine(
    (data) =>
      data.radio !== YES ||
      (data.nationalId && kennitala.isValid(data.nationalId)),
    {
      path: ['nationalId'], // Focuses on the 'nationalId' field
    },
  )

export const WorkAccidentNotificationAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v), // TODO ?
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

export type WorkAccidentNotification = z.TypeOf<
  typeof WorkAccidentNotificationAnswersSchema
>
export type CompanyType = z.TypeOf<typeof companySchema>
export type CompanyLaborProtectionType = z.TypeOf<
  typeof companyLaborProtectionSchema
>
export type AccidentType = z.TypeOf<typeof accidentSchema>
export type EmployeeType = z.TypeOf<typeof employeeSchema>
