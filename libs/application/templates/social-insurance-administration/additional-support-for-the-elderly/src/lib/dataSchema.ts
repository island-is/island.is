import { z } from 'zod'
import { errorMessages } from './messages'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  period: z
  .object({
    year: z.string(),
    month: z.string(),
  })
  .refine(
    (p) => {
      //const today = new Date()
      const startDate = subMonths(new Date(), 3) //addYears(today.setMonth(today.getMonth()), -2)
      const endDate = addMonths(new Date(), 6)
      const selectedDate = new Date(p.year + p.month)
      return startDate < selectedDate && selectedDate < endDate
    },
    { params: errorMessages.period, path: ['month'] },
  ),
})
export type SchemaFormValues = z.infer<typeof dataSchema>
