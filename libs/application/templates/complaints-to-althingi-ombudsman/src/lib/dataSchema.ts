import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as z from 'zod'
import {
  ComplainedForTypes,
  ComplaineeTypes,
  GenderAnswerOptions,
  OmbudsmanComplaintTypeEnum,
} from '../shared'
import { error } from './messages/error'
import { NO, YES } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const ComplaintsToAlthingiOmbudsmanSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, { params: error.required }),
  applicant: applicantInformationSchema({ phoneRequired: true }),
  complainedFor: z.object({
    decision: z.enum([
      ComplainedForTypes.MYSELF,
      ComplainedForTypes.SOMEONEELSE,
    ]),
  }),
  complainee: z.object({
    type: z.enum([ComplaineeTypes.GOVERNMENT, ComplaineeTypes.OTHER]),
  }),
  complaintType: z.enum([
    OmbudsmanComplaintTypeEnum.DECISION,
    OmbudsmanComplaintTypeEnum.PROCEEDINGS,
  ]),
  appeals: z.enum([YES, NO]),
  complainedForInformation: z.object({
    name: z.string().refine((v) => v, { params: error.required }),
    nationalId: z.string().refine((v) => v, { params: error.required }),
    address: z.string().refine((v) => v, { params: error.required }),
    postalCode: z.string().refine((v) => v, { params: error.required }),
    city: z.string().refine((v) => v, { params: error.required }),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    connection: z.string().refine((v) => v, { params: error.required }),
    powerOfAttorney: z.array(FileSchema).optional(),
  }),
  complaintDescription: z.object({
    decisionDate: z.string().optional(),
    complaineeName: z.string().refine((val) => (val ? val.length > 0 : false), {
      params: error.required,
    }),
    complaintDescription: z
      .string()
      .refine((val) => (val ? val.length > 0 : false), {
        params: error.required,
      }),
  }),
  courtActionAnswer: z.enum([YES, NO]),
  preexistingComplaint: z.enum([YES, NO]),
  previousOmbudsmanComplaint: z
    .object({
      Answer: z.enum([YES, NO]),
      moreInfo: z.string().optional(),
    })
    .refine(
      (val) => {
        if (val.Answer && val.Answer === NO) {
          return true
        }
        return val?.moreInfo ? val.moreInfo.length > 0 : false
      },
      {
        params: error.required,
        path: ['moreInfo'],
      },
    ),
  attachments: z.object({ documents: z.array(FileSchema).optional() }),
  genderAnswer: z.nativeEnum(GenderAnswerOptions),
})

export type ComplaintsToAlthingiOmbudsman = z.TypeOf<
  typeof ComplaintsToAlthingiOmbudsmanSchema
>
