import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as z from 'zod'
import {
  ComplainedForTypes,
  ComplaineeTypes,
  NO,
  OmbudsmanComplaintTypeEnum,
  YES,
} from '../shared'
import { error } from './messages/error'

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
    ssn: z.string().refine((v) => v, { params: error.required }),
    address: z.string().refine((v) => v, { params: error.required }),
    postcode: z.string().refine((v) => v, { params: error.required }),
    city: z.string().refine((v) => v, { params: error.required }),
    email: z.string().optional(),
    phone: z.string().optional(),
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
  attachments: z.object({ documents: z.array(FileSchema).optional() }),
})

export type ComplaintsToAlthingiOmbudsman = z.TypeOf<
  typeof ComplaintsToAlthingiOmbudsmanSchema
>
