import { z } from 'zod'

export const DisabilityLicenseUpdateData = z.object({
  nafn: z.string(),
  kennitala: z.number(),
  gildirTil: z.preprocess((arg) => {
    if (typeof arg === 'string') return new Date(arg)
  }, z.date()),
})

export type DisabilityLicenseUpdateData = z.infer<
  typeof DisabilityLicenseUpdateData
>
