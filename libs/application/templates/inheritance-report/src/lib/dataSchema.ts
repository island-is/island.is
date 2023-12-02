import * as z from 'zod'
import * as kennitala from 'kennitala'

export const inheritanceReportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  applicant: z.object({
    email: z.string().email(),
    phone: z.string(),
    nationalId: z.string(),
  }),

  /* assets */
  assets: z.object({
    realEstate: z
      .object({
        data: z
          .object({
            assetNumber: z.string(),
            description: z.string(),
            propertyValuation: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    vehicles: z
      .object({
        data: z
          .object({
            assetNumber: z.string(),
            description: z.string(),
            propertyValuation: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    guns: z
      .object({
        data: z
          .object({
            assetNumber: z.string(),
            description: z.string(),
            propertyValuation: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    inventory: z
      .object({
        data: z
          .object({
            inventory: z.string(),
            inventoryValue: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    bankAccounts: z
      .object({
        data: z
          .object({
            accountNumber: z.string(),
            balance: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    claims: z
      .object({
        data: z
          .object({
            issuer: z.string(),
            nationalId: z.string(),
            value: z.string().refine((v) => v),
          })
          .refine(
            ({ nationalId }) => {
              return nationalId && nationalId !== ''
                ? kennitala.isValid(nationalId)
                : true
            },
            {
              path: ['nationalId'],
            },
          )
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    stocks: z
      .object({
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
      })
      .optional(),
    money: z
      .object({
        data: z
          .object({
            moneyValue: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    otherAssets: z
      .object({
        data: z
          .object({
            otherAssets: z.string(),
            otherAssetsValue: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    assetsTotal: z.number().optional(),
  }),

  /* debts */
  debts: z.object({
    domesticAndForeignDebts: z
      .object({
        data: z
          .object({
            creditorName: z.string(),
            nationalId: z.string(),
            balance: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    publicCharges: z
      .object({
        data: z
          .object({
            publicChargesAmount: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    debtsTotal: z.number().optional(),
  }),

  funeralCostAmount: z.string().refine((v) => v),

  /* business */
  business: z.object({
    businessAssets: z
      .object({
        data: z
          .object({
            businessAsset: z.string(),
            businessAssetValue: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    businessDebts: z
      .object({
        data: z
          .object({
            businessDebt: z.string(),
            nationalId: z.string(),
            debtValue: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    businessTotal: z.number().optional(),
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
    total: z
      .number()
      //.refine((v) => v === 100)
      .optional(),
  }),

  heirsAdditionalInfo: z.string().optional(),

  totalDeduction: z.string(),
})

export type InheritanceReport = z.TypeOf<typeof inheritanceReportSchema>
