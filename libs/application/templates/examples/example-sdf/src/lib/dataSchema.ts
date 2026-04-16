import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  selectedPlot: z.string().min(1, 'You must select a plot'),
  requestedSizeSqm: z
    .string()
    .min(1, 'Requested size is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: 'Must be a positive number',
    })
    .refine((v) => Number(v) <= 500, {
      message: 'Maximum plot size is 500 sqm',
    }),
  enlargementReason: z.string().min(1, 'Please provide a reason'),

  needsWaterAccess: z.enum(['yes', 'no']),
  irrigationType: z.string().optional(),

  acceptedRules: z
    .array(z.enum(['composting', 'noPesticides', 'maintainPaths']))
    .min(1, 'You must agree to at least one rule'),
  additionalNotes: z.string().optional(),

  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
  phone: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'either']),
})

export type ExampleSdfAnswers = z.TypeOf<typeof dataSchema>
