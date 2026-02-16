import { z } from 'zod'
import * as kennitala from 'kennitala'
import { NO, YES } from '@island.is/application/core'
import { error } from './messages'

const UserSchemaBase = z.object({
  nationalId: z.string().refine((nationalId) => {
    return (
      nationalId &&
      nationalId.length !== 0 &&
      kennitala.isValid(nationalId) &&
      (kennitala.isCompany(nationalId) || kennitala.info(nationalId).age >= 18)
    )
  }),
  name: z.string().min(1),
  address: z.string().min(1),
  postalCode: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  citizenship: z.string().min(1),
  residenceInIcelandLastChangeDateStr: z.string().optional(),
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
    dateTo: z.string().optional(),
    dateFrom: z.string().optional(),
  })
  .refine(
    ({ wasRemoved, countryId }) => {
      return wasRemoved === 'true' || (countryId && countryId.length > 0)
    },
    {
      path: ['countryId'],
    },
  )
  .refine(
    ({ dateTo, dateFrom }) => {
      const to = dateTo ? new Date(dateTo).getTime() : null
      const from = dateFrom ? new Date(dateFrom).getTime() : null

      if (from && to) {
        return to > from
      }

      return true
    },
    {
      path: ['dateRange'],
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
    currentName: z.string(),
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

const PassportSchema = z
  .object({
    publishDate: z.string().min(1),
    expirationDate: z.string().min(1),
    passportNumber: z.string().min(1),
    passportTypeId: z.string().min(1),
    countryOfIssuerId: z.string().min(1),
    attachment: z.array(FileDocumentSchema).min(1),
  })
  .refine(
    ({ expirationDate, publishDate }) => {
      const to = expirationDate ? new Date(expirationDate).getTime() : null
      const from = publishDate ? new Date(publishDate).getTime() : null

      if (from && to) {
        return to > from
      }

      return true
    },
    {
      params: error.passportDateError,
      path: ['expirationDate'],
    },
  )

const ChildrenPassportSchema = z
  .object({
    nationalId: z.string().min(1),
    publishDate: z.string().min(1),
    expirationDate: z.string().min(1),
    passportNumber: z.string().min(1),
    passportTypeId: z.string().min(1),
    countryOfIssuerId: z.string().min(1),
    attachment: z.array(FileDocumentSchema).min(1),
  })
  .refine(
    ({ expirationDate, publishDate }) => {
      const to = expirationDate ? new Date(expirationDate).getTime() : null
      const from = publishDate ? new Date(publishDate).getTime() : null

      if (from && to) {
        return to > from
      }

      return true
    },
    {
      params: error.passportDateError,
      path: ['expirationDate'],
    },
  )

const MaritalStatusSchema = z.object({
  status: z.string().optional(),
  nationalId: z.string().min(1),
  birthCountry: z.string().optional(),
  name: z.string().min(1),
  citizenship: z.string().optional(),
  dateOfMaritalStatusStr: z.string().min(1),
  explanation: z.string().optional(),
})

const CriminalRecordSchema = z.object({
  countryId: z.string().min(1),
  attachment: z.array(FileDocumentSchema).min(1),
})

const SupportingDocumentsSchema = z
  .object({
    birthCertificateRequired: z.string().min(1),
    birthCertificate: z.array(FileDocumentSchema).optional(),
    subsistenceCertificate: z.array(FileDocumentSchema).min(1),
    subsistenceCertificateForTown: z.array(FileDocumentSchema).min(1),
    certificateOfLegalResidenceHistory: z.array(FileDocumentSchema).min(1),
    icelandicTestCertificate: z.array(FileDocumentSchema).min(1),
    criminalRecord: z.array(CriminalRecordSchema).optional(),
  })
  .refine(
    ({ birthCertificateRequired, birthCertificate }) => {
      return (
        birthCertificateRequired === 'false' ||
        (birthCertificate && birthCertificate.length > 0)
      )
    },
    {
      path: ['birthCertificate'],
    },
  )

const ChildrenSupportingDocumentsSchema = z
  .object({
    nationalId: z.string().min(1),
    birthCertificate: z.array(FileDocumentSchema).min(1),
    writtenConsentFromChildRequired: z.string().min(1),
    writtenConsentFromChild: z.array(FileDocumentSchema).optional(),
    writtenConsentFromOtherParentRequired: z.string().min(1),
    writtenConsentFromOtherParent: z.array(FileDocumentSchema).optional(),
    custodyDocumentsRequired: z.string().min(1),
    custodyDocuments: z.array(FileDocumentSchema).optional(),
  })
  .refine(
    ({ writtenConsentFromChildRequired, writtenConsentFromChild }) => {
      return (
        writtenConsentFromChildRequired === 'false' ||
        (writtenConsentFromChild && writtenConsentFromChild.length > 0)
      )
    },
    {
      path: ['writtenConsentFromChild'],
    },
  )
  .refine(
    ({
      writtenConsentFromOtherParentRequired,
      writtenConsentFromOtherParent,
    }) => {
      return (
        writtenConsentFromOtherParentRequired === 'false' ||
        (writtenConsentFromOtherParent &&
          writtenConsentFromOtherParent.length > 0)
      )
    },
    {
      path: ['writtenConsentFromOtherParent'],
    },
  )
  .refine(
    ({ custodyDocumentsRequired, custodyDocuments }) => {
      return (
        custodyDocumentsRequired === 'false' ||
        (custodyDocuments && custodyDocuments.length > 0)
      )
    },
    {
      path: ['custodyDocuments'],
    },
  )

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
    ({ wasRemoved, otherParentBirtDate, otherParentNationalId }) => {
      return (
        wasRemoved === 'true' ||
        otherParentNationalId ||
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
  childrenPassport: z.array(ChildrenPassportSchema.nullable()).optional(),
  maritalStatus: MaritalStatusSchema,
  formerIcelander: z.enum([YES, NO]), //.refine((v) => v === YES) // TODO REVERT WHEN UTL FIXED SERVICES
  supportingDocuments: SupportingDocumentsSchema,
  childrenSupportingDocuments: z
    .array(ChildrenSupportingDocumentsSchema.nullable())
    .optional(),
})

export type Citizenship = z.TypeOf<typeof CitizenshipSchema>
