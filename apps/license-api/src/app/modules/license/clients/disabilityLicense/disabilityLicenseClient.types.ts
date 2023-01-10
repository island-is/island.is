import { z } from 'zod'
import { DateSchema } from '../../license.types'

export const DisabilityLicenseUpdateData = z.object({
  nafn: z.string(),
  kennitala: z.number(),
  gildirTil: DateSchema,
})

export type DisabilityLicenseUpdateData = z.infer<
  typeof DisabilityLicenseUpdateData
>
