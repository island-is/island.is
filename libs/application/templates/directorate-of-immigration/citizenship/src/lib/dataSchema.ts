import { z } from 'zod'
import * as kennitala from 'kennitala'

const UserSchemaBase = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId &&
        nationalId.length !== 0 &&
        kennitala.isValid(nationalId) &&
        (kennitala.isCompany(nationalId) ||
          kennitala.info(nationalId).age >= 18),
    ),
  name: z.string().min(1),
  address: z.string().min(1),
  postalCode: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  citizenship: z.string().min(1),
  residenceInIcelandLastChangeDate: z.string().min(1),
  birthCountry: z.string().min(1),
})

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

const ResidenceConditionSchema = z.object({
  radio: z.string().min(1),
})

export const RemoveableStayAbroadSchema = z
  .object({
    country: z.string().optional(),
    dateTo: z.string().optional(),
    dateFrom: z.string().optional(),
    purpose: z.string().optional(),
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

export const RemoveableCountrySchema = z
  .object({
    country: z.string(),
    wasRemoved: z.string().min(1).optional(),
  })
  .refine(
    ({ wasRemoved, country }) => {
      return wasRemoved === 'true' || (country && country.length > 0)
    },
    {
      path: ['country'],
    },
  )

const CountriesOfResidenceSchema = z.object({
  hasLivedAbroad: z.string().min(1),
  selectedAbroadCountries: z.array(RemoveableCountrySchema).optional(),
})

export const ParentInformationSchema = z
  .object({
    nationalId: z.string().optional(),
    name: z.string().optional(),
    wasRemoved: z.string().min(1).optional(),
  })
  .refine(
    ({ wasRemoved, nationalId, name }) => {
      console.log('wasRemoved', wasRemoved)
      return (
        wasRemoved === 'true' ||
        (nationalId && nationalId.length > 0 && name && name.length > 0)
      )
    },
    {
      path: ['nationalId'],
    },
  )

const ParentsSchema = z.object({
  hasValidParents: z.string().min(1),
  parents: z.array(ParentInformationSchema).optional(),
})

const PassportSchema = z.object({
  publishDate: z.string().min(1),
  expirationDate: z.string().min(1),
  passportNumber: z.string().min(1),
  passportType: z.string().min(1),
  publisher: z.string().min(1),
})

const MaritalStatusSchema = z.object({
  status: z.string().min(1),
  nationalId: z.string().min(1),
  birthCountry: z.string().min(1),
  name: z.string().min(1),
  citizenship: z.string().min(1),
  dateOfMarritalStatus: z.string().min(1),
})

export const CitizenshipSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  selectedChildren: z.array(z.string()).optional(),
  residenceCondition: ResidenceConditionSchema,
  parentInformation: ParentsSchema,
  spouse: z.string().min(1),
  countriesOfResidence: CountriesOfResidenceSchema,
  staysAbroad: StaysAbroadSchema,
  passport: z.array(PassportSchema),
  maritalStatus: MaritalStatusSchema,
  formerIcelander: z.string().refine((v) => v === 'Yes'),
})

export type Citizenship = z.TypeOf<typeof CitizenshipSchema>
