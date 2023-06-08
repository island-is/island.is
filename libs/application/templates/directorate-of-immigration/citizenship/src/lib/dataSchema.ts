import { string, z } from 'zod'
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

export const RemoveableStayAbroadSchema = z.object({
  country: z.string().min(1),
  dateTo: z.string().min(1),
  dateFrom: z.string().min(1),
  purposeOfStay: z.string().min(1),
  wasRemoved: z.string().min(1).optional()
})

const StaysAbroadSchema = z.object({
  hasStayedAbroad: z.string().min(1),
  selectedAbroadCountries: z.array(RemoveableStayAbroadSchema)
})

export const RemoveableCountrySchema = z.object({
  country: z.string().min(1),
  wasRemoved: z.string().min(1).optional()
})

const CountriesOfResidenceSchema = z.object({
  hasLivedAbroad: z.string().min(1),
  selectedAbroadCountries: z.array(RemoveableCountrySchema)
})

export const CitizenshipSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  selectedChildren: z.array(z.string()).optional(),
  residenceCondition: ResidenceConditionSchema,
  parents: z.array(z.string()).optional(),
  spouse: z.string().min(1),
  countriesOfResidence: CountriesOfResidenceSchema,
  countriesOfStays: StaysAbroadSchema
})

export type Citizenship = z.TypeOf<typeof CitizenshipSchema>
