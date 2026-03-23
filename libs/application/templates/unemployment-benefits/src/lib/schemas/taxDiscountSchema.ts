import { z } from 'zod'

export const taxDiscountSchema = z.object({
  taxDiscount: z.string().refine((value) => {
    const numberValue = parseInt(value, 10)
    return (
      typeof numberValue === 'number' &&
      !isNaN(numberValue) &&
      numberValue >= 0 &&
      numberValue <= 100
    )
  }),
})
