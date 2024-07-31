import { z } from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { AnswerOptions } from './types'

const contact = z.object({
  name: z.string().nonempty({ message: 'Nafn þarf að vera útfyllt' }),
  email: z.string().email({ message: 'Netfang þarf að vera gilt' }),
  phoneNumber: z.string().refine(
    (p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    },
    { message: 'Símanúmerið þarf að vera gilt' },
  ),
})

const helpDesk = z.object({
  email: z.string().email({ message: 'Netfang þarf að vera gilt' }),
  phoneNumber: z.string().refine(
    (p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    },
    { message: 'Símanúmer þarf að vera gilt' },
  ),
})

//TODO: extend contact. Couldn't get it to work easily with contact.extend
const applicant = z.object({
  name: z.string().nonempty({ message: 'Nafn þarf að vera útfyllt' }),
  email: z.string().email({ message: 'Netfang þarf að vera gilt' }),
  phoneNumber: z.string().refine(
    (p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    },
    { message: 'Símanúmer þarf að vera gilt' },
  ),
  nationalId: z.string().refine((k) => kennitala.isValid(k), {
    message: 'Skrá þarf löglega kennitölu, með eða án bandstriks',
  }),
  // .refine((k) => kennitala.isCompany(k), {
  //   message: 'Skrá þarf kennitölu fyrirtækis eða stofnunar',
  // }),
})

const termsOfAgreement = z.object({
  userTerms: z
    .array(
      z.nativeEnum(AnswerOptions).refine((v) => v === AnswerOptions.YES, {}),
    )
    .length(1),
})

const endPointObject = z.object({
  endPoint: z.string().url().nonempty(),
  endPointExists: z.string().nonempty({
    message: 'Þú verður að vista endapunkt til að halda áfram',
  }),
})

const productionEndPointObject = z.object({
  prodEndPoint: z.string().url().nonempty(),
  prodEndPointExists: z.string().nonempty({
    message: 'Þú verður að vista endapunkt til að halda áfram',
  }),
})

export const dataSchema = z.object({
  termsOfAgreement,
  applicant,
  administrativeContact: contact,
  technicalContact: contact,
  helpDesk,
  technicalAnswer: z.boolean().refine((v) => v, {
    message: 'Þú verður að samþykkja að forritun og prófunum sé lokið',
  }),
  endPointObject,
  testProviderId: z.string().nonempty({
    message: 'Þú verður að stofna aðgang til að halda áfram',
  }),
  prodProviderId: z.string().nonempty({
    message: 'Þú verður að stofna aðgang til að halda áfram',
  }),
  productionEndPointObject,
  rejectionReason: z.string(),
  approvedByReviewer: z.enum(['APPROVE', 'REJECT']),
})
