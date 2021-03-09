import * as z from 'zod'
import { YES, NO } from '../shared'
import { error } from './messages/error'
import * as kennitala from 'kennitala'

export enum OnBehalf {
  MYSELF = 'myself',
  MYSELF_AND_OR_OTHERS = 'myselfAndOrOthers',
  COMPANY = 'company',
  ORGANIZATION_OR_INSTITUTION = 'organizationOrInsititution',
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string(),
})

export const DataProtectionComplaintSchema = z.object({
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
    onBehalf: z
      .enum([
        OnBehalf.MYSELF,
        OnBehalf.MYSELF_AND_OR_OTHERS,
        OnBehalf.COMPANY,
        OnBehalf.ORGANIZATION_OR_INSTITUTION,
      ])
      .refine(
        (p) =>
          p === OnBehalf.MYSELF ||
          p === OnBehalf.MYSELF_AND_OR_OTHERS ||
          p === OnBehalf.ORGANIZATION_OR_INSTITUTION,
        {
          message: error.onBehalfOfACompany.defaultMessage,
        },
      ),
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
})
