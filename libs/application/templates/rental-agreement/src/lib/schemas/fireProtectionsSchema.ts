import { z } from 'zod'
import * as m from '../../lib/messages'

export const fireProtections = z.object({
  smokeDetectors: z.string().min(1),
  fireExtinguisher: z.string().min(0),
  emergencyExits: z.string().optional(),
  fireBlanket: z.string().optional(),
  propertySize: z
    .array(
      z.object({
        size: z.number().optional(),
        changedSize: z.number().optional(),
      }),
    )
    .optional(),
})
