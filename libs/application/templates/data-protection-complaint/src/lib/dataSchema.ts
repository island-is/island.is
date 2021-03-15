import * as z from 'zod'
import { YES, NO } from '../shared'
import { error } from './messages/error'
import * as kennitala from 'kennitala'

export enum OnBehalf {
  MYSELF = 'myself',
  MYSELF_AND_OR_OTHERS = 'myselfAndOrOthers',
  OTHERS = 'others',
  ORGANIZATION_OR_INSTITUTION = 'organizationOrInsititution',
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string(),
})

export const DataProtectionComplaintSchema = z.object({
  approveExternalData: z.boolean().refine((p) => p),
  inCourtProceedings: z.enum([YES, NO]).refine((p) => p === NO, {
    message: error.inCourtProceedings.defaultMessage,
  }),
  concernsMediaCoverage: z.enum([YES, NO]).refine((p) => p === NO, {
    message: error.concernsMediaCoverage.defaultMessage,
  }),
  concernsBanMarking: z.enum([YES, NO]).refine((p) => p === NO, {
    message: error.concernsBanMarking.defaultMessage,
  }),
  concernsLibel: z.enum([YES, NO]).refine((p) => p === NO, {
    message: error.concernsLibel.defaultMessage,
  }),
  info: z.object({
    onBehalf: z.enum([
      OnBehalf.MYSELF,
      OnBehalf.MYSELF_AND_OR_OTHERS,
      OnBehalf.OTHERS,
      OnBehalf.ORGANIZATION_OR_INSTITUTION,
    ]),
  }),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().nonempty(),
    postalCode: z.string().nonempty(),
    city: z.string().nonempty(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
  organizationOrInstitution: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? kennitala.isCompany(x) : false)),
    address: z.string().nonempty(),
    postalCode: z.string().nonempty(),
    city: z.string().nonempty(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
  commissions: z.object({
    // TODO: This should be required
    documents: z.array(FileSchema),
    persons: z
      .array(
        z.object({
          name: z.string().nonempty(),
          nationalId: z
            .string()
            .refine((x) => (x ? kennitala.isPerson(x) : false)),
        }),
      )
      .nonempty(),
  }),
  complainee: z.object({
    name: z.string().nonempty(),
    address: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? kennitala.isValid(x) : false)),
    operatesWithinEurope: z.enum([YES, NO]),
    countryOfOperation: z.string().optional(),
  }),
  additionalComplainees: z.array(
    z.object({
      name: z.string().nonempty(),
      address: z.string().nonempty(),
      nationalId: z.string().refine((x) => (x ? kennitala.isValid(x) : false)),
      operatesWithinEurope: z.enum([YES, NO]),
      countryOfOperation: z.string().optional(),
    }),
  ),
  subjectOfComplaint: z.object({
    authorities: z.array(z.string()).optional(),
    useOfPersonalInformation: z.array(z.string()).optional(),
    other: z.array(z.string()).optional(),
    somethingElse: z.string().optional(),
  }),
  complaint: z.object({
    description: z.string().nonempty(),
    // TODO: This should be required
    documents: z.array(FileSchema),
  }),
  overview: z.object({
    termsAgreement: z.array(z.string()).refine((x) => x?.includes('agreed')),
  }),
})

export type DataProtectionComplaint = z.TypeOf<
  typeof DataProtectionComplaintSchema
>
