import { z } from 'zod'

export const RemoveableCriminalRecordSchema = z
  .object({
    countryId: z.string(),
    date: z.string().optional(),
    typeOfOffense: z.string().optional(),
    punishment: z.string().optional(),
    wasRemoved: z.string().optional(),
  })
  .refine(
    ({ wasRemoved, countryId }) => {
      return wasRemoved === 'true' || (countryId && countryId.length > 0)
    },
    {
      path: ['country'],
    },
  )
  .refine(
    ({ wasRemoved, date }) => {
      return wasRemoved === 'true' || (date && date.length > 0)
    },
    {
      path: ['date'],
    },
  )
  .refine(
    ({ wasRemoved, typeOfOffense }) => {
      return (
        wasRemoved === 'true' || (typeOfOffense && typeOfOffense.length > 0)
      )
    },
    {
      path: ['typeOfOffense'],
    },
  )
  .refine(
    ({ wasRemoved, punishment }) => {
      return wasRemoved === 'true' || (punishment && punishment.length > 0)
    },
    {
      path: ['punishment'],
    },
  )

const CriminalRecordSchema = z.object({
  hasCriminalRecord: z.string().min(1),
  selectedCriminalCountries: z.array(RemoveableCriminalRecordSchema).optional(),
})

export const RemoveableEmploymentSchema = z
  .object({
    name: z.string(),
    country: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    applicationFile: z.string().optional(),
    employmentContract: z.string().optional(),
    typeOfEmployment: z.string().optional(),
    wasRemoved: z.string().optional(),
  })
  .refine(
    ({ wasRemoved, country }) => {
      return wasRemoved === 'true' || (country && country.length > 0)
    },
    {
      path: ['country'],
    },
  )
  .refine(
    ({ wasRemoved, name }) => {
      return wasRemoved === 'true' || (name && name.length > 0)
    },
    {
      path: ['name'],
    },
  )
  .refine(
    ({ wasRemoved, dateTo }) => {
      return wasRemoved === 'true' || (dateTo && dateTo.length > 0)
    },
    {
      path: ['dateTo'],
    },
  )
  .refine(
    ({ wasRemoved, dateFrom }) => {
      return wasRemoved === 'true' || (dateFrom && dateFrom.length > 0)
    },
    {
      path: ['dateFrom'],
    },
  )

const EmploymentSchema = z.object({
  selectedEmployments: z.array(RemoveableEmploymentSchema).optional(),
})

export const RemoveableStayAbroadSchema = z
  .object({
    countryId: z.string(),
    dateTo: z.string().optional(),
    dateFrom: z.string().optional(),
    purpose: z.string().optional(),
    wasRemoved: z.string().optional(),
  })
  .refine(
    ({ wasRemoved, countryId }) => {
      return wasRemoved === 'true' || (countryId && countryId.length > 0)
    },
    {
      path: ['country'],
    },
  )
  .refine(
    ({ wasRemoved, dateTo }) => {
      return wasRemoved === 'true' || (dateTo && dateTo.length > 0)
    },
    {
      path: ['dateTo'],
    },
  )
  .refine(
    ({ wasRemoved, dateFrom }) => {
      return wasRemoved === 'true' || (dateFrom && dateFrom.length > 0)
    },
    {
      path: ['dateFrom'],
    },
  )
  .refine(
    ({ wasRemoved, purpose }) => {
      return wasRemoved === 'true' || (purpose && purpose.length > 0)
    },
    {
      path: ['purpose'],
    },
  )
  .refine(
    ({ dateTo, dateFrom }) => {
      const to = dateTo ? new Date(dateTo).getTime() : null
      const from = dateFrom ? new Date(dateFrom).getTime() : null

      const threeMonths = 7.884e9

      if (from && to) {
        const difference = to - from
        return difference >= threeMonths
      }

      return true
    },
    {
      path: ['dateRange'],
    },
  )

const StaysAbroadSchema = z.object({
  hasStayedAbroad: z.string().min(1),
  selectedAbroadCountries: z.array(RemoveableStayAbroadSchema).optional(),
})

export const StudySchema = z.object({
  schoolSSN: z.string().min(1),
  schoolName: z.string().min(1),
  confirmationFile: z.array(z.string()).optional(),
  graduationFile: z.array(z.string()).optional(),
  continuedEducationFile: z.array(z.string()).optional(),
})

export const ResidencePermitRenewalSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: z.object({
    email: z.string().min(1),
    phone: z.string().min(1),
    securityPin: z.string().min(4),
  }),
  selectedIndividuals: z.array(z.string()).optional(),
  staysAbroad: StaysAbroadSchema,
  criminalRecord: CriminalRecordSchema,
  studyInformation: StudySchema,
})

export type ResidencePermitRenewal = z.TypeOf<
  typeof ResidencePermitRenewalSchema
>
