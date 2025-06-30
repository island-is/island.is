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
    phone: z.string().refine((v) => isValidPhoneNumber(v)),
    email: z.string().email(),
    selfOrOthers: z.nativeEnum(SelfOrOthers),
    licenseNumber: z.string().optional(),
    countryOfIssue: z.string().nullish(),
  })
  .refine(
    (data) => {
      if (data.selfOrOthers === SelfOrOthers.self) {
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
    individualOrCompany: z
      .enum([IndividualOrCompany.individual, IndividualOrCompany.company])
      .nullish(),
    paymentOptions: z
      .enum([PaymentOptions.cashOnDelivery, PaymentOptions.putIntoAccount])
      .nullish()
      .or(z.literal('')) // Explicitly allow empty strings since clearing this field turns it to an empty string
      .transform((val) => (val === '' ? undefined : val)), // Convert "" to undefined,
    companyInfo: z
      .object({
        nationalId: z.string().nullish(),
        name: z.string().nullish(),
      })
      .nullish()
      .or(z.literal('')) // Explicitly allow empty strings since clearing this field turns it to an empty string
      .transform((val) => (val === '' ? undefined : val)), // Convert "" to undefined
    individualInfo: z
      .object({
        email: z.string().nullish(),
        phone: z.string().nullish(),
      })
      .nullish(),
    contactInfo: z
      .object({
        email: z.string().nullish(),
        phone: z.string().nullish(),
      })
      .nullish(),
    explanation: z.string().max(40).nullish(),
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
      if (individualOrCompany === IndividualOrCompany.individual) {
        return true
      }

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
      licenseNumber: z.string().min(1).max(25),
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
      categoriesMayTeach: z.string().optional(),
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
  categories: z.array(
    z.object({
      disabled: z.boolean(),
      label: z.string(),
      value: z.string(),
    }),
  ),
  instructor: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  isValid: z.boolean(),
  doesntHaveToPayLicenseFee: z.boolean(),
  nationalId: z.string().optional(),
  medicalCertificate: z
    .array(
      z
        .object({
          key: z.string(),
          name: z.string(),
        })
        .optional(),
    )
    .optional(),
})

const ExamLocationSchema = z.object({
  address: z.string().min(1).max(49),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  email: z.string().email(),
  postalCode: z.string().min(3).max(3),
})

const OverviewSchema = z.object({
  agreementCheckbox: z.array(z.string().min(1)).nonempty(),
})

export const PracticalExamAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  information: InformationSchema,
  examinees: ExamineeSchema,
  instructors: InstructorSchema,
  examLocation: ExamLocationSchema,
  paymentArrangement: PaymentArrangementSchema,
  examCategories: z.array(ExamCategorySchema).refine((data) => {
    if (data.every((cat) => cat.isValid)) return true
    return false
  }),
  examCategoryTable: z.array(z.array(z.string())),
  overview: OverviewSchema,
})

export type PracticalExamAnswers = z.TypeOf<typeof PracticalExamAnswersSchema>
export type PaymentArrangementType = z.TypeOf<typeof PaymentArrangementSchema>
export type ExamineeType = z.TypeOf<typeof ExamineeSchema>
export type ExamCategoryType = z.TypeOf<typeof ExamCategorySchema>
export type InstructorType = z.TypeOf<typeof InstructorSchema>
export type InformationType = z.TypeOf<typeof InformationSchema>
export type ExamLocationType = z.TypeOf<typeof ExamLocationSchema>
