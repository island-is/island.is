import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidEmail, isValidPhoneNumber } from '../utils'
import { YES } from '@island.is/application/core'
import {
  IndividualOrCompany,
  PaymentOptions,
  RegisterNumber,
} from '../shared/types'
import { participants as participantMessages } from './messages'

const UserSchemaBase = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  name: z.string().min(1),
  email: z.string().refine((x) => isValidEmail(x)),
  phoneNumber: z.string().refine((x) => isValidPhoneNumber(x)),
  registerManyQuestion: z.nativeEnum(RegisterNumber).optional(),
})

export const PaymentArrangementSchema = z
  .object({
    individualOrCompany: z.nativeEnum(IndividualOrCompany),
    paymentOptions: z.nativeEnum(PaymentOptions).optional(),
    companyInfo: z
      .object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    contactInfo: z
      .object({
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
    explanation: z.string().optional(),
  })
  .refine(
    ({ companyInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        companyInfo &&
        companyInfo.name &&
        companyInfo.nationalId &&
        companyInfo.nationalId.length > 0 &&
        kennitala.isCompany(companyInfo.nationalId)
      )
    },
    {
      path: ['companyInfo', 'nationalId'],
    },
  )
  .refine(
    ({ paymentOptions, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        (paymentOptions === PaymentOptions.cashOnDelivery ||
          paymentOptions === PaymentOptions.putIntoAccount)
      )
    },
    {
      path: ['paymentOptions'],
    },
  )
  .refine(
    ({ contactInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        contactInfo &&
        contactInfo.email &&
        contactInfo.email.length > 0 &&
        isValidEmail(contactInfo.email)
      )
    },
    {
      path: ['contactInfo', 'email'],
    },
  )
  .refine(
    ({ contactInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        contactInfo &&
        contactInfo.phone &&
        contactInfo.phone.length > 0 &&
        isValidPhoneNumber(contactInfo.phone)
      )
    },
    {
      path: ['contactInfo', 'phone'],
    },
  )

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

export const ParticipantSchema = z.object({
  nationalIdWithName: z.object({
    name: z.string().min(1),
    nationalId: z
      .string()
      .refine(
        (nationalId) =>
          nationalId &&
          nationalId.length !== 0 &&
          kennitala.isValid(nationalId),
      ),
  }),
  email: z
    .string()
    .min(1)
    .refine((x) => isValidEmail(x)),
  phoneNumber: z
    .string()
    .min(1)
    .refine((x) => isValidPhoneNumber(x)),
  disabled: z.string().optional(),
})

const PersonalValidationSchema = z
  .object({
    canRegister: z.boolean(),
    registerMany: z.boolean(),
  })
  .refine((v) => v.canRegister || v.registerMany)

export const SeminarAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: UserInformationSchema,
  paymentArrangement: PaymentArrangementSchema,
  personalValidation: PersonalValidationSchema,
  participantList: z
    .array(ParticipantSchema)
    .refine(
      (pList) => {
        const hasDisabled = pList.filter((x) => x.disabled === 'true')
        return hasDisabled.length === 0
      },
      {
        params: participantMessages.labels.tableError,
      },
    )
    .refine((plist) => plist.length > 0, {
      params: participantMessages.labels.emptyListError,
    }),
  participantCsvError: z.string().optional(),
  participantValidityError: z.string().optional(),
  participantFinishedValidation: z.string().refine((x) => x === 'true'),
  paymentAgreementCheckbox: z.array(z.string()).refine((v) => v.includes(YES)),
})
