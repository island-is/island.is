import * as z from 'zod'

export const inheritanceReportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  /* assets */
  realEstate: z.object({
    data: z
      .object({
        assetNumber: z.string(),
        description: z.string(),
        propertyValuation: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  vehicles: z.object({
    data: z
      .object({
        assetNumber: z.string(),
        description: z.string(),
        propertyValuation: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  inventory: z.object({
    data: z
      .object({
        inventory: z.string(),
        inventoryValue: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  bankAccounts: z.object({
    data: z
      .object({
        accountNumber: z.string(),
        balance: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  claims: z.object({
    data: z
      .object({
        issuer: z.string(),
        value: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  stocks: z.object({
    data: z
      .object({
        organization: z.string(),
        nationalId: z.string(),
        faceValue: z.string(),
        rateOfExchange: z.string(),
        value: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  money: z.object({
    data: z
      .object({
        moneyValue: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  otherAssets: z.object({
    data: z
      .object({
        otherAssets: z.string(),
        otherAssetsValue: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),

  /* debts */
  domesticAndForeignDebts: z.object({
    data: z
      .object({
        creditorName: z.string(),
        nationalId: z.string(),
        balance: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  publicCharges: z.object({
    data: z
      .object({
        publicChargesAmount: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  funeralCostAmount: z.string().refine((v) => v),

  /* business */
  businessAssets: z.object({
    data: z
      .object({
        businessAsset: z.string(),
        businessAssetValue: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  businessDebts: z.object({
    data: z
      .object({
        businessDebt: z.string(),
        nationalId: z.string(),
        debtValue: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),

  /* heirs */
  heirs: z.object({
    data: z
      .object({
        nationalId: z.string(),
        heirsName: z.string(),
        email: z.string(),
        phone: z.string(),
        relation: z.string(),
        heirsPercentage: z.string(),
        taxFreeInheritance: z.number(),
        inheritance: z.number(),
        taxableInheritance: z.number(),
        inheritanceTax: z.number(),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
})

export type InheritanceReport = z.TypeOf<typeof inheritanceReportSchema>
