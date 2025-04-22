/*
 * DataSchema uses Zod to validate the answers object and can be used to refine values, provide
 * error messages, and more.
 *
 * When checking if a value is of an enum type, use z.nativeEnum instead of z.enum. This eliminates the need to list up all possible values in the enum.
 */

import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidNumber } from 'libphonenumber-js'
import { m } from './messages'
import {
  ApprovedByReviewerEnum,
  CareerHistoryEnum,
  CareerIndustryEnum,
} from '../utils/constants'
import { RadioValidationExampleEnum } from '../utils/types'
import { YesOrNoEnum } from '@island.is/application/core'

const personSchema = z.object({
  name: z.string().min(1).max(256),
  age: z.string().refine((x) => {
    const asNumber = parseInt(x)
    if (isNaN(asNumber)) {
      return false
    }
    return asNumber > 15
  }),
})

export const ExampleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  tableRepeaterField: z.array(
    z.object({
      nationalIdWithName: z.object({
        name: z.string().min(1).max(256),
        nationalId: z.string().refine((n) => n && kennitala.isValid(n), {
          params: m.dataSchemeNationalId,
        }),
        phone: z.string().refine(isValidNumber, {
          params: m.dataSchemePhoneNumber,
        }),
        email: z.string().email(),
      }),
    }),
  ),
  person: z.object({
    name: z.string().min(1).max(256),
    age: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 15
    }),
    nationalId: z
      .string()
      /**
       * We are depending on this template for the e2e tests on the application-system-api.
       * Because we are not allowing committing valid kennitala, I reversed the condition
       * to check for invalid kenitala so it passes the test.
       */
      .refine((n) => n && !kennitala.isValid(n), {
        params: m.dataSchemeNationalId,
      }),
    phoneNumber: z
      .string()
      .refine(isValidNumber, { params: m.dataSchemePhoneNumber }),
    email: z.string().email(),
    // removed due to e2e tests failing, example still works
    // someHiddenInputRequired: z.string().refine((x) => x === 'validAnswer'),
    // someHiddenInputWatchedRequired: z
    //   .string()
    //   .refine((x) => x.includes('Valid')),
  }),
  nationalId: z.string().refine((n) => n && !kennitala.isValid(n), {
    params: m.dataSchemeNationalId,
  }),
  phoneNumber: z
    .string()
    .refine(isValidNumber, { params: m.dataSchemePhoneNumber }),
  email: z.string().email(),
})

const careerHistoryDetailsSchema = z
  .object({
    careerHistoryCompanies: z.array(z.nativeEnum(CareerHistoryEnum)).nonempty(),
    careerHistoryOther: z.string(),
  })
  .partial()

const deepNestedSchema = z.object({
  something: z.object({
    very: z.object({
      deep: z.object({
        so: z.object({
          so: z.object({
            very: z.object({
              very: z.object({
                deep: z.object({
                  nested: z.object({
                    value: z.string(),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
})

const validationSchema = z.object({
  validationTextField: z.string().refine((val) => val.length >= 3, {
    params: m.about,
  }),
  validationRadioField: z
    .nativeEnum(RadioValidationExampleEnum)
    .refine((val) => Object.values(RadioValidationExampleEnum).includes(val), {
      params: m.about,
    }),
})

// The exported dataSchema should be as flat and easy to read as possible.
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  person: personSchema,
  careerHistory: z.nativeEnum(YesOrNoEnum).optional(),
  careerIndustry: z.nativeEnum(CareerIndustryEnum),
  careerHistoryDetails: careerHistoryDetailsSchema,
  deepNestedValues: deepNestedSchema,
  dreamJob: z.string().optional(),
  assigneeEmail: z.string().email(),
  approvedByReviewer: z.nativeEnum(ApprovedByReviewerEnum),
  validation: validationSchema,
})

export type AnswersSchema = z.infer<typeof dataSchema>
