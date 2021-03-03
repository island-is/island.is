import * as z from 'zod'
import { YES, NO } from '../shared'
import { error } from './messages/error'

export enum OnBehalf {
  MYSELF = 'myself',
  MYSELF_AND_OR_OTHERS = 'myselfAndOrOthers',
  COMPANY = 'company',
  ORGANIZATION_OR_INSTITUTION = 'organizationOrInsititution',
}

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

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
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    address: z.string().nonempty(),
    zipCode: z.string().nonempty(),
    city: z.string().nonempty(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
})
