import { z } from 'zod'
import { europeanHealthInsuranceCardApplicationMessages } from './messages'

export const checkboxSchema = z
  .object({
    applyForPlastic: z.array(z.string()).optional(),
    addForPDF: z.array(z.string()).optional(),
  })
  .refine(
    (v) => v.applyForPlastic?.length || v.addForPDF?.length,
    (v) => {
      return {
        message: 'You need to select at least one checkbox',
        params:
          europeanHealthInsuranceCardApplicationMessages.data.checkboxError,
        path: v.applyForPlastic?.length ? ['addForPDF'] : ['applyForPlastic'],
      }
    },
  )

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  delimitations: checkboxSchema,
})
