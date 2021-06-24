import * as kennitala from 'kennitala'
import * as z from 'zod'
import { OmbudsmanComplaintTypeEnum, ComplaineeTypes } from '../shared'
import { error } from './messages/error'

export const ComplaintsToAlthingiOmbudsmanSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  externalData: z.object({
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          city: z.string(),
          code: z.string(),
          postalCode: z.string(),
          streetAddress: z.string(),
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
  information: z.object({
    name: z.string().nonempty(error.required.defaultMessage),
    ssn: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().nonempty(error.required.defaultMessage),
    postcode: z.string().nonempty(error.required.defaultMessage),
    city: z.string().nonempty(error.required.defaultMessage),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
  complainee: z.object({
    type: z.enum([ComplaineeTypes.GOVERNMENT, ComplaineeTypes.OTHER]),
  }),
  complaintInformation: z.object({
    complaintType: z.enum([
      OmbudsmanComplaintTypeEnum.DECISION,
      OmbudsmanComplaintTypeEnum.PROCEEDINGS,
    ]),
  }),
  complaintDescription: z.object({
    complaineeName: z.string().nonempty(error.required.defaultMessage),
    complaintDescription: z.string().nonempty(error.required.defaultMessage),
  }),
})

export type ComplaintsToAlthingiOmbudsman = z.TypeOf<
  typeof ComplaintsToAlthingiOmbudsmanSchema
>
