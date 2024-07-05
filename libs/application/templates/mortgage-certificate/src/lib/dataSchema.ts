import { z } from 'zod'
import { PropertyTypes } from './constants'

const Property = z.object({
  propertyNumber: z.string(),
  propertyName: z.string(),
  propertyType: z.string(),
})

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
    properties: z.array(Property).nonempty(),
  }),
  incorrectPropertiesSent: z.array(Property).optional(),
})

export type MortgageCertificate = z.TypeOf<typeof MortgageCertificateSchema>
