import * as kennitala from 'kennitala'
import { z } from 'zod'

export const safeTextSchema = z
  .string()
  .min(1, 'errorRequired')
  .regex(/^[^<>%$]+$/, 'errorUnsafeChars')

export const nationalIdSchema = z
  .string()
  .min(1, 'errorNationalId')
  .refine((value) => value.length === 10 && kennitala.isValid(value), {
    message: 'errorNationalId',
  })

export const contactEmailSchema = z
  .string()
  .email('errorEmail')
  .or(z.literal(''))
  .optional()
