import { z } from 'zod'
import * as kennitala from 'kennitala'
import { IndividualOrCompany, PaymentOptions } from '../shared/contstants'
import { isValidPhoneNumber } from '../utils'

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
})

const PaymentArrangementSchema = z.object({
  individualOrCompany: z.enum([
    IndividualOrCompany.individual,
    IndividualOrCompany.company,
  ]),
  paymentOptions: z.enum([
    PaymentOptions.cashOnDelivery,
    PaymentOptions.putIntoAccount,
  ]),
  companyInfo: z.object({
    nationalId: z.string().refine((v) => kennitala.isCompany(v)),
    label: z.string().min(1),
  }),
  // individualInfo: z.object({
  //   email: z.string().email(),
  //   phone: z.string().refine((v) => isValidPhoneNumber(v)),
  // }).optional(),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string().refine((v) => isValidPhoneNumber(v)),
  }),
  explanation: z.string().optional(),
  // agreementCheckbox: z.string().optional(), // .min(1),
}) // TODO: refine super well!

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

const ParticipantSchema = z.object({
  name: z.string().min(1),
  ssn: z.string().min(1),
})

export const SeminarAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: UserInformationSchema,
  paymentArrangement: PaymentArrangementSchema,
  participantList: z.array(ParticipantSchema),
})

export type SeminarAnswers = z.TypeOf<typeof SeminarAnswersSchema>
