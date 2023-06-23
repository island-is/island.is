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

export const ParentInformationSchema = z.object({
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
})

export const RemoveableStayAbroadSchema = z
  .object({
    country: z.string().optional(),
    dateTo: z.string().optional(),
    dateFrom: z.string().optional(),
    purpose: z.string().optional(),
    wasRemoved: z.string().min(1).optional(),
  })
  .refine(
    ({ wasRemoved, country }) => {
      return wasRemoved === 'true' || country !== ''
    },
    {
      path: ['country'],
    },
  )
  .refine(
    ({ wasRemoved, dateTo }) => {
      return wasRemoved === 'true' || (dateTo && dateTo !== '')
    },
    {
      path: ['dateTo'],
    },
  )
  .refine(
    ({ wasRemoved, dateFrom }) => {
      return wasRemoved === 'true' || (dateFrom && dateFrom !== '')
    },
    {
      path: ['dateFrom'],
    },
  )
  .refine(
    ({ wasRemoved, purpose }) => {
      return wasRemoved === 'true' || (purpose && purpose !== '')
    },
    {
      path: ['purpose'],
    },
  )

const StaysAbroadSchema = z
  .object({
    hasStayedAbroad: z.string().min(1),
    selectedAbroadCountries: z.array(RemoveableStayAbroadSchema).optional(),
  })
  .refine(({ hasStayedAbroad, selectedAbroadCountries }) => {
    //if the answer to the question is Yes than the user needs to provide at least one valid country from select input
    return (
      (hasStayedAbroad === 'Yes' &&
        selectedAbroadCountries &&
        selectedAbroadCountries.filter((c) => c.wasRemoved === 'false').length >
          0) ||
      hasStayedAbroad === 'No'
    )
  })

export const RemoveableCountrySchema = z
  .object({
    country: z.string(),
    wasRemoved: z.string().min(1).optional(),
  })
  .refine(({ wasRemoved, country }) => {
    return wasRemoved === 'true' || country !== ''
  })

const CountriesOfResidenceSchema = z
  .object({
    hasLivedAbroad: z.string().min(1),
    selectedAbroadCountries: z.array(RemoveableCountrySchema).optional(),
  })
  .refine(({ hasLivedAbroad, selectedAbroadCountries }) => {
    //if the answer to the question is Yes than the user needs to provide at least one valid country from select input
    return (
      (hasLivedAbroad === 'Yes' &&
        selectedAbroadCountries &&
        selectedAbroadCountries.filter((c) => c.wasRemoved === 'false').length >
          0) ||
      hasLivedAbroad === 'No'
    )
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
  parents: z.array(ParentInformationSchema).optional(),
  spouse: z.string().min(1),
  countriesOfResidence: CountriesOfResidenceSchema,
  staysAbroad: StaysAbroadSchema,
  passport: z.array(PassportSchema), //TODO á þetta að vera array?
  maritalStatus: MaritalStatusSchema,
})

export type Citizenship = z.TypeOf<typeof CitizenshipSchema>
