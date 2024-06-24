import { z } from 'zod'
import { PropertyTypes } from './constants'

export const MortgageCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  selectedProperties: z.object({
    propertyType: z
      .enum([
        PropertyTypes.REAL_ESTATE,
        PropertyTypes.VEHICLE,
        PropertyTypes.SHIP,
      ])
      .optional(),
    searchStr: z.string().optional(),
    properties: z
      .array(
        z.object({
          propertyNumber: z.string(),
          propertyName: z.string(),
          propertyType: z.string(),
        }),
      )
      .nonempty(),
  }),
  incorrectPropertiesSent: z
    .array(
      z.object({
        propertyNumber: z.string(),
        propertyName: z.string(),
        propertyType: z.string(),
      }),
    )
    .optional(),
})

export type MortgageCertificate = z.TypeOf<typeof MortgageCertificateSchema>
