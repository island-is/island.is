import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
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
  information: z.object({
    name: z.string().nonempty(),
    ssn: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().nonempty(),
    postcode: z.string().nonempty(),
    city: z.string().nonempty(),
    email: z
      .string()
      .email()
      .refine((val) => (val ? val.length > 0 : false), {
        params: error.required,
      }),
    phone: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        return phoneNumber && phoneNumber.isValid()
      },
      {
        params: error.required,
      },
    ),
  }),
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
    name: z.string(),
    ssn: z.string(),
    address: z.string(),
    postcode: z.string(),
    city: z.string(),
    email: z.string(),
    phone: z.string(),
    connection: z.string(),
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
