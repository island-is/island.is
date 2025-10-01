import { z } from 'zod'

export const fireProtectionsSchema = z.object({
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
