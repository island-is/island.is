import * as kennitala from 'kennitala'
import * as z from 'zod'
import { NO, YES } from '../shared'
import { error } from './messages/error'

export enum OnBehalf {
  MYSELF = 'myself',
  MYSELF_AND_OR_OTHERS = 'myselfAndOrOthers',
  OTHERS = 'others',
  ORGANIZATION_OR_INSTITUTION = 'organizationOrInsititution',
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

// Validation on optional field: https://github.com/colinhacks/zod/issues/310
const optionalEmail = z.string().email().optional().or(z.literal(''))

export const DataProtectionComplaintSchema = z.object({
  externalData: z.object({
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          city: z.string(),
          code: z.string(),
          postalCode: z.string(),
          streetAddress: z.string(),
        }),
        age: z.number(),
        citizenship: z.object({
          code: z.string(),
          name: z.string(),
        }),
        fullName: z.string(),
        legalResidence: z.string(),
        nationalId: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
    userProfile: z.object({
      data: z.object({
        email: z.string(),
        mobilePhoneNumber: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
  }),
  approveExternalData: z.boolean().refine((p) => p),
  inCourtProceedings: z.enum([YES, NO]).refine((p) => p === NO, {
    params: error.inCourtProceedings,
  }),
  concernsMediaCoverage: z.enum([YES, NO]).refine((p) => p === NO, {
    params: error.concernsMediaCoverage,
  }),
  concernsBanMarking: z.enum([YES, NO]).refine((p) => p === NO, {
    params: error.concernsBanMarking,
  }),
  concernsLibel: z.enum([YES, NO]).refine((p) => p === NO, {
    params: error.concernsLibel,
  }),
  concernsPersonalDataConflict: z.enum([YES, NO]),
  info: z.object({
    onBehalf: z.enum([
      OnBehalf.MYSELF,
      OnBehalf.MYSELF_AND_OR_OTHERS,
      OnBehalf.OTHERS,
      OnBehalf.ORGANIZATION_OR_INSTITUTION,
    ]),
  }),
  applicant: z.object({
    name: z.string().refine((x) => !!x, { params: error.required }),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
      params: error.nationalId,
    }),
    address: z.string().refine((x) => !!x, { params: error.required }),
    postalCode: z.string().refine((x) => !!x, { params: error.required }),
    city: z.string().refine((x) => !!x, { params: error.required }),
    email: optionalEmail,
    phoneNumber: z.string().optional(),
  }),
  organizationOrInstitution: z.object({
    name: z.string().refine((x) => !!x, { params: error.required }),
    nationalId: z.string().refine((x) => (x ? kennitala.isCompany(x) : false), {
      params: error.nationalId,
    }),
    address: z.string().refine((x) => !!x, { params: error.required }),
    postalCode: z.string().refine((x) => !!x, { params: error.required }),
    city: z.string().refine((x) => !!x, { params: error.required }),
    email: optionalEmail,
    phoneNumber: z.string().optional(),
  }),
  commissions: z.object({
    documents: z.array(FileSchema).nonempty(),
    persons: z
      .array(
        z.object({
          name: z.string().refine((x) => !!x, { params: error.required }),
          nationalId: z
            .string()
            .refine((x) => (x ? kennitala.isPerson(x) : false)),
        }),
      )
      .nonempty(),
  }),
  complainees: z.array(
    z.object({
      name: z.string().refine((x) => !!x, { params: error.required }),
      address: z.string().refine((x) => !!x, { params: error.required }),
      nationalId: z.string().optional(),
      operatesWithinEurope: z.enum([YES, NO]),
      countryOfOperation: z
        .string()
        .refine((x) => !!x, { params: error.required }),
    }),
  ),
  subjectOfComplaint: z.object({
    values: z.array(z.string()).optional(),
    somethingElse: z.string().optional(),
    somethingElseValue: z.string().refine((x) => x.trim().length > 0, {
      params: error.required,
    }),
  }),
  complaint: z.object({
    description: z
      .string()
      .nonempty()
      .refine((x) => !!x, { params: error.required })
      .refine((x) => x?.split(' ').filter((item) => item).length <= 500, {
        params: error.wordCountReached,
      }),

    documents: z.array(FileSchema),
  }),
  externalDataMessage: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    nationalRegistryTitle: z.string(),
    nationalRegistryDescription: z.string(),
    userProfileTitle: z.string(),
    userProfileDescription: z.string(),
    checkboxText: z.string(),
  }),
  informationMessage: z.object({
    title: z.string(),
    bullets: z.array(
      z.object({
        bullet: z.string(),
        link: z.string(),
        linktText: z.string(),
      }),
    ),
  }),
})

export type DataProtectionComplaint = z.TypeOf<
  typeof DataProtectionComplaintSchema
>
