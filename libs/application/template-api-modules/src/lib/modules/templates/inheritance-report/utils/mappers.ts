import { EstateAsset, EstateInfo } from '@island.is/clients/syslumenn'
import { infer as zinfer } from 'zod'
import { inheritanceReportSchema } from '@island.is/application/templates/inheritance-report'
import { filterEmptyObjects } from './filters'

type InheritanceReportSchema = zinfer<typeof inheritanceReportSchema>
type InheritanceData = InheritanceReportSchema['assets']

const initialMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    propertyValuation: '0',
  }
}

export const trueOrHasYes = (element: string | boolean): string => {
  const elementString = element.toString().toLowerCase()
  const value = elementString === 'yes' || elementString === 'true'
  return value.toString()
}

export const estateTransformer = (estate: EstateInfo): InheritanceData => {
  const realEstate = estate.assets.map((el) => initialMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) => initialMapper<EstateAsset>(el))
  const guns = estate.guns.map((el) => initialMapper<EstateAsset>(el))

  return {
    ...estate,
    realEstate: {
      data: realEstate,
    },
    vehicles: {
      data: vehicles,
    },
    guns: {
      data: guns,
    },
  }
}

// -----------------------------------------------------------------
// ----------------------- EXPANDERS -------------------------------
// -----------------------------------------------------------------
// Optional properties do not appear as part of the data entry object
// When coming from the frontend.
// For processing on their end, the district commissioner requires that
// we maximally expand everything to include the same properties but with
// some sensible defaults on missing properties.
// Therefore we just expand these properties according to the schema specifications.
// Please, if there is a better way to do this, do it.

export const expandAnswers = (
  answers: InheritanceReportSchema,
): InheritanceReportSchema => {
  return {
    applicant: answers.applicant,
    approveExternalData: answers.approveExternalData,
    assets: {
      assetsTotal: answers.assets.assetsTotal ?? 0,
      bankAccounts: {
        data: (answers.assets.bankAccounts?.data ?? []).map((account) => {
          return {
            accountNumber: account.accountNumber ?? '',
            balance: account.balance ?? '',
          }
        }),
        total: answers.assets.bankAccounts?.total ?? 0,
      },
      claims: {
        data: (answers.assets.claims?.data ?? []).map((claim) => {
          return {
            issuer: claim.issuer ?? '',
            value: claim.value ?? '',
          }
        }),
        total: answers.assets.claims?.total ?? 0,
      },
      guns: {
        data: (answers.assets.guns?.data ?? []).map((gun) => {
          return {
            assetNumber: gun.assetNumber ?? '',
            description: gun.description ?? '',
            propertyValuation: gun.propertyValuation ?? '',
          }
        }),
        total: answers.assets.guns?.total ?? 0,
      },
      inventory: {
        data: (answers.assets.inventory?.data ?? []).map((item) => {
          return {
            inventory: item.inventory ?? '',
            inventoryValue: item.inventoryValue ?? '',
          }
        }),
        total: answers.assets.inventory?.total ?? 0,
      },
      money: {
        data: (answers.assets.money?.data ?? []).map((money) => {
          return {
            moneyValue: money.moneyValue ?? '',
          }
        }),
        total: answers.assets.money?.total ?? 0,
      },
      otherAssets: {
        data: (answers.assets.otherAssets?.data ?? []).map((asset) => {
          return {
            otherAssets: asset.otherAssets ?? '',
            otherAssetsValue: asset.otherAssetsValue ?? '',
          }
        }),
        total: answers.assets.otherAssets?.total ?? 0,
      },
      realEstate: {
        data: (answers.assets.realEstate?.data ?? []).map((realEstate) => {
          return {
            assetNumber: realEstate.assetNumber ?? '',
            description: realEstate.description ?? '',
            propertyValuation: realEstate.propertyValuation ?? '',
          }
        }),
        total: answers.assets.realEstate?.total ?? 0,
      },
      stocks: {
        data: (answers.assets.stocks?.data ?? []).map((stock) => {
          return {
            faceValue: stock.faceValue ?? '',
            nationalId: stock.nationalId ?? '',
            organization: stock.organization ?? '',
            rateOfExchange: stock.rateOfExchange ?? '',
            value: stock.value ?? '',
          }
        }),
        total: answers.assets.stocks?.total ?? 0,
      },
      vehicles: {
        data: (answers.assets.vehicles?.data ?? []).map((vehicle) => {
          return {
            assetNumber: vehicle.assetNumber ?? '',
            description: vehicle.description ?? '',
            propertyValuation: vehicle.propertyValuation ?? '',
          }
        }),
        total: answers.assets.vehicles?.total ?? 0,
      },
    },
    business: {
      businessAssets: {
        data: (answers.business.businessAssets?.data ?? []).map((asset) => {
          return {
            businessAsset: asset.businessAsset ?? '',
            businessAssetValue: asset.businessAssetValue ?? 0,
          }
        }),
        total: answers.business.businessAssets?.total ?? 0,
      },
      businessDebts: {
        data: (answers.business.businessDebts?.data ?? []).map((debt) => {
          return {
            businessDebt: debt.businessDebt ?? '',
            debtValue: debt.debtValue ?? 0,
            nationalId: debt.nationalId ?? '',
          }
        }),
        total: answers.business.businessDebts?.total ?? 0,
      },
      businessTotal: answers.business.businessTotal ?? 0,
    },
    debts: {
      debtsTotal: answers.debts.debtsTotal ?? 0,
      domesticAndForeignDebts: {
        data: (answers.debts.domesticAndForeignDebts?.data ?? []).map(
          (debt) => {
            return {
              balance: debt.balance ?? 0,
              creditorName: debt.creditorName ?? '',
              nationalId: debt.nationalId ?? '',
            }
          },
        ),
        total: answers.debts.domesticAndForeignDebts?.total ?? 0,
      },
      publicCharges: {
        data: (answers.debts.publicCharges?.data ?? []).map((charge) => {
          return {
            publicChargesAmount: charge.publicChargesAmount ?? 0,
          }
        }),
        total: answers.debts.publicCharges?.total ?? 0,
      },
    },
    funeralCostAmount: answers.funeralCostAmount ?? '',
    heirs: {
      data: (answers.heirs?.data ?? []).map((heir) => {
        return {
          email: heir.email ?? '',
          heirsName: heir.heirsName ?? '',
          heirsPercentage: heir.heirsPercentage ?? 0,
          inheritance: heir.inheritance ?? '',
          inheritanceTax: heir.inheritanceTax ?? 0,
          nationalId: heir.nationalId ?? '',
          phone: heir.phone ?? '',
          relation: heir.relation ?? '',
          taxableInheritance: heir.taxableInheritance ?? 0,
          taxFreeInheritance: heir.taxFreeInheritance ?? 0,
        }
      }),
      total: answers.heirs?.total ?? 0,
    },
    totalDeduction: answers.totalDeduction ?? 0,
    heirsAdditionalInfo: answers.heirsAdditionalInfo ?? '',
  }
}
