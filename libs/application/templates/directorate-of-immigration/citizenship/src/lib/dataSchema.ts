import { z } from 'zod'
import * as kennitala from 'kennitala'
import { NO, YES } from '@island.is/application/core'

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
  residenceInIcelandLastChangeDate: z.string().optional(),
  birthCountry: z.string().optional(),
})

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

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
  hasStayedAbroad: z.enum([YES, NO]),
  selectedAbroadCountries: z.array(RemoveableStayAbroadSchema).optional(),
})

export const RemoveableCountrySchema = z
  .object({
    countryId: z.string(),
    wasRemoved: z.string().min(1),
  })
  .refine(
    ({ wasRemoved, countryId }) => {
      return wasRemoved === 'true' || (countryId && countryId.length > 0)
    },
    {
      path: ['countryId'],
    },
  )

const CountriesOfResidenceSchema = z.object({
  hasLivedAbroad: z.enum([YES, NO]),
  selectedAbroadCountries: z.array(RemoveableCountrySchema).optional(),
})

export const ParentInformationSchema = z
  .object({
    nationalId: z.string().optional(),
    givenName: z.string().optional(),
    familyName: z.string().optional(),
    wasRemoved: z.string().min(1).optional(),
  })
  .refine(
    ({ wasRemoved, nationalId, givenName, familyName }) => {
      return (
        wasRemoved === 'true' ||
        (nationalId &&
          nationalId.length > 0 &&
          givenName &&
          givenName.length > 0 &&
          familyName &&
          familyName.length > 0)
      )
    },
    {
      path: ['nationalId'],
    },
  )

const ParentsSchema = z.object({
  hasValidParents: z.enum([YES, NO]),
  parents: z.array(ParentInformationSchema).optional(),
})

const FileDocumentSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const PassportSchema = z.object({
  publishDate: z.string().min(1),
  expirationDate: z.string().min(1),
  passportNumber: z.string().min(1),
  passportTypeId: z.string().min(1),
  countryOfIssuerId: z.string().min(1),
  attachment: z.array(FileDocumentSchema).optional(),
})

const ChildrenPassportSchema = z.object({
  nationalId: z.string().min(1),
  publishDate: z.string().min(1),
  expirationDate: z.string().min(1),
  passportNumber: z.string().min(1),
  passportTypeId: z.string().min(1),
  countryOfIssuerId: z.string().min(1),
  attachment: z.array(FileDocumentSchema).optional(),
})

const MaritalStatusSchema = z.object({
  status: z.string().min(1),
  nationalId: z.string().min(1),
  birthCountry: z.string().optional(),
  name: z.string().min(1),
  citizenship: z.string().optional(),
  dateOfMaritalStatusStr: z.string().min(1),
  explanation: z.string().optional(),
})

const CriminalRecordSchema = z.object({
  countryId: z.string().min(1),
  attachment: z.array(FileDocumentSchema).optional(),
})

const SupportingDocumentsSchema = z.object({
  birthCertificate: z.array(FileDocumentSchema).optional(),
  subsistenceCertificate: z.array(FileDocumentSchema).optional(),
  subsistenceCertificateForTown: z.array(FileDocumentSchema).optional(),
  certificateOfLegalResidenceHistory: z.array(FileDocumentSchema).optional(),
  icelandicTestCertificate: z.array(FileDocumentSchema).optional(),
  criminalRecord: z.array(CriminalRecordSchema).optional(),
})

const ChildrenSupportingDocumentsSchema = z.object({
  nationalId: z.string().min(1),
  birthCertificate: z.array(FileDocumentSchema).optional(),
  writtenConsentFromChild: z.array(FileDocumentSchema).optional(),
  writtenConsentFromOtherParent: z.array(FileDocumentSchema).optional(),
  custodyDocuments: z.array(FileDocumentSchema).optional(),
})

export const SelectedChildSchema = z
  .object({
    nationalId: z.string().min(1),
    hasFullCustody: z.string().optional(),
    otherParentNationalId: z.string().optional(),
    otherParentBirtDate: z.string().optional(),
    otherParentName: z.string().optional(),
    wasRemoved: z.string().min(1).optional(),
  })
  .refine(
    ({ wasRemoved, otherParentName }) => {
      return (
        wasRemoved === 'true' || (otherParentName && otherParentName.length > 0)
      )
    },
    {
      path: ['otherParentName'],
    },
  )
  .refine(
    ({ wasRemoved, otherParentBirtDate }) => {
      return (
        wasRemoved === 'true' ||
        (otherParentBirtDate && otherParentBirtDate.length > 0)
      )
    },
    {
      path: ['otherParentBirtDate'],
    },
  )

export const CitizenshipSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  selectedChildren: z.array(z.string()).optional(),
  selectedChildrenExtraData: z.array(SelectedChildSchema).optional(),
  parentInformation: ParentsSchema,
  spouse: z.string().min(1),
  countriesOfResidence: CountriesOfResidenceSchema,
  staysAbroad: StaysAbroadSchema,
  passport: PassportSchema,
  childrenPassport: z.array(ChildrenPassportSchema).optional(),
  maritalStatus: MaritalStatusSchema,
  // TODO revert
  // formerIcelander: z
  //   .string()
  //   .min(1)
  //   .refine((v) => v === YES),
  formerIcelander: z.enum([YES, NO]),
  supportingDocuments: SupportingDocumentsSchema,
  childrenSupportingDocuments: z
    .array(ChildrenSupportingDocumentsSchema)
    .optional(),
})

export type Citizenship = z.TypeOf<typeof CitizenshipSchema>
