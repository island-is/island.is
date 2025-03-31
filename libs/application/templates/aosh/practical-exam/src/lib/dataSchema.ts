import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidEmail } from '../utils'
import { isValidPhoneNumber } from '../utils/validation'
import {
  IndividualOrCompany,
  PaymentOptions,
  SelfOrOthers,
  TrueOrFalse,
} from '../utils/enums'
import { instructor as mInstructor } from '../lib/messages'

const InformationSchema = z
  .object({
    name: z.string().min(1).max(256),
    nationalId: z
      .string()
      .refine(
        (nationalId) =>
          nationalId &&
          nationalId.length !== 0 &&
          kennitala.isValid(nationalId),
      ),
    phone: z.string().optional(), //.refine((v) => isValidPhoneNumber(v)), // TODO Refine again, dev issues with no email/phone
    email: z.string().optional(), // TODO Remove optional add .email(), dev issues with no email/phone
    selfOrOthers: z.nativeEnum(SelfOrOthers),
    licenseNumber: z.string().optional(),
    countryOfIssue: z.string().nullish(),
  })
  .refine(
    (data) => {
      if (data.selfOrOthers === SelfOrOthers.others) {
        // TODO(balli) Create util function to validate license number ??
        return data.licenseNumber && data.countryOfIssue
      }

      return true
    },
    {
      path: [''],
    },
  )

const PaymentArrangementSchema = z
  .object({
    individualOrCompany: z.enum([
      IndividualOrCompany.individual,
      IndividualOrCompany.company,
    ]),
    paymentOptions: z
      .enum([PaymentOptions.cashOnDelivery, PaymentOptions.putIntoAccount])
      .optional(),
    companyInfo: z
      .object({
        nationalId: z.string().optional(),
        label: z.string().optional(),
      })
      .optional(),
    individualInfo: z
      .object({
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
    contactInfo: z
      .object({
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
    explanation: z.string().optional(),
    agreementCheckbox: z.array(z.string().min(1)).nonempty(),
  })
  .refine(
    ({ individualInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.company) return true
      return (
        individualOrCompany === IndividualOrCompany.individual &&
        individualInfo &&
        individualInfo.email &&
        individualInfo.email.length > 0 &&
        isValidEmail(individualInfo.email)
      )
    },
    {
      path: ['individualInfo', 'email'],
    },
  )
  .refine(
    ({ individualInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.company) return true
      return (
        individualOrCompany === IndividualOrCompany.individual &&
        individualInfo &&
        individualInfo.phone &&
        isValidPhoneNumber(individualInfo?.phone)
      )
    },
    {
      path: ['individualInfo', 'phone'],
    },
  )
  .refine(
    ({ companyInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        companyInfo &&
        companyInfo.label &&
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

const ExamineeSchema = z
  .array(
    z.object({
      nationalId: z.object({
        nationalId: z.string().refine(
          (nationalId) => {
            return (
              nationalId &&
              nationalId.length !== 0 &&
              kennitala.isValid(nationalId)
              // TOOO validate age above 17
            )
          },
          {
            path: [''],
          },
        ),
        name: z.string().min(1).max(256),
      }),
      email: z.string().refine((email) => isValidEmail(email)),
      phone: z.string().refine((phone) => isValidPhoneNumber(phone)),
      licenseNumber: z.string().optional(), // TODO(balli) Need validation rules from VER
      countryIssuer: z.string().min(1).max(256),
      disabled: z.enum([TrueOrFalse.true, TrueOrFalse.false]).optional(),
    }),
  )
  .min(1)

const InstructorSchema = z
  .array(
    z.object({
      nationalId: z.object({
        nationalId: z.string().refine((nationalId) => {
          return (
            nationalId &&
            nationalId.length !== 0 &&
            kennitala.isValid(nationalId)
          )
        }),
        name: z.string().min(1).max(256),
      }),
      email: z.string().refine((email) => isValidEmail(email)),
      phone: z.string().refine((phone) => isValidPhoneNumber(phone)),
      disabled: z.enum([TrueOrFalse.true, TrueOrFalse.false]).optional(),
    }),
  )
  .min(1)
  .superRefine((data, ctx) => {
    const emails = new Set()
    const phones = new Set()
    const nationalIds = new Set()

    data.forEach((instructor, index) => {
      if (emails.has(instructor.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: mInstructor.tableRepeater.duplicateError,
          path: [index, 'email'], // Pointing to the specific instructor
        })
      }
      if (phones.has(instructor.phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: mInstructor.tableRepeater.duplicateError,
          path: [index, 'phone'],
        })
      }
      if (nationalIds.has(instructor.nationalId.nationalId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: mInstructor.tableRepeater.duplicateError,
          path: [index, 'nationalId', 'nationalId'],
        })
      }

      // Add to sets after checking to ensure the first occurrence is allowed
      emails.add(instructor.email)
      phones.add(instructor.phone)
      nationalIds.add(instructor.nationalId.nationalId)
    })
  })

const ExamCategorySchema = z.object({
  nationalId: z.string().refine((nationalId) => {
    return (
      nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId)
    )
  }),
  name: z.string().min(1).max(256),
  categoryAndInstructor: z.array(
    z.object({
      category: z.string().min(1).max(256),
      instructor: z.object({
        nationalId: z.string().refine((nationalId) => {
          return (
            nationalId &&
            nationalId.length !== 0 &&
            kennitala.isValid(nationalId)
          )
        }),
        name: z.string().min(1).max(256),
      }),
    }),
  ),
})

const ExamLocationSchema = z.object({
  address: z.string().min(1).max(128),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  email: z.string().email(),
  postalCode: z.string().min(3).max(3),
})

export const PracticalExamAnswersSchema = z.object({
  information: InformationSchema,
  examinees: ExamineeSchema,
  instructors: InstructorSchema,
  examLocation: ExamLocationSchema,
  paymentArrangement: PaymentArrangementSchema,
  examCategory: z.array(ExamCategorySchema),
})

export type PracticalExamAnswers = z.TypeOf<typeof PracticalExamAnswersSchema>
export type PaymentArrangementType = z.TypeOf<typeof PaymentArrangementSchema>
export type ExamineeType = z.TypeOf<typeof ExamineeSchema>
export type ExamCategoryType = z.TypeOf<typeof ExamCategorySchema>
export type InstructorType = z.TypeOf<typeof InstructorSchema>
