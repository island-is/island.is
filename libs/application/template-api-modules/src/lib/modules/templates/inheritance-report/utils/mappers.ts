import {
  EstateAsset,
  EstateInfo,
  EstateMember,
} from '@island.is/clients/syslumenn'
import { infer as zinfer } from 'zod'
import { inheritanceReportSchema } from '@island.is/application/templates/inheritance-report'

type InheritanceReportSchema = zinfer<typeof inheritanceReportSchema>
type InheritanceData = InheritanceReportSchema['assets']

const initialMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    propertyValuation: '0',
    share: '0',
  }
}

export const trueOrHasYes = (element: string | boolean): string => {
  const elementString = element.toString().toLowerCase()
  const value = elementString === 'yes' || elementString === 'true'
  return value.toString()
}

const estateMemberMapper = (element: EstateMember) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    heirsPercentage: '',
    inheritance: '',
    inheritanceTax: '',
    taxableInheritance: '',
    taxFreeInheritance: '',
    phone: '',
    email: '',
    advocate: element.advocate
      ? {
          ...element.advocate,
          phone: '',
          email: '',
        }
      : undefined,
  }
}

export const estateTransformer = (estate: EstateInfo): InheritanceData => {
  const realEstate = estate.assets.map((el) => initialMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) => initialMapper<EstateAsset>(el))
  const guns = estate.guns.map((el) => initialMapper<EstateAsset>(el))
  const estateMembers = estate.estateMembers.map((el) => estateMemberMapper(el))

  const data = {
    ...estate,
    estateMembers,
    realEstate: {
      data: realEstate,
      hasModified: false,
    },
    vehicles: {
      data: vehicles,
      hasModified: false,
    },
    guns: {
      data: guns,
    },
  }

  return data
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
            nationalId: claim.nationalId ?? '',
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
        info: answers.assets.inventory?.info ?? '',
        value: answers.assets.inventory?.value ?? '',
      },
      money: {
        info: answers.assets.money?.info ?? '',
        value: answers.assets.money?.value ?? '',
      },
      otherAssets: {
        info: answers.assets.otherAssets?.info ?? '',
        value: answers.assets.otherAssets?.value ?? '',
      },
      realEstate: {
        data: (answers.assets.realEstate?.data ?? []).map((realEstate) => {
          return {
            assetNumber: realEstate.assetNumber ?? '',
            description: realEstate.description ?? '',
            propertyValuation: realEstate.propertyValuation ?? '0',
            share: realEstate.share ?? '0',
          }
        }),
        hasModified: answers.assets.realEstate?.hasModified ?? false,
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
        hasModified: answers.assets.vehicles?.hasModified ?? false,
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
            loanIdentity: debt.loanIdentity ?? '',
            businessDebt: debt.businessDebt ?? '',
            debtValue: debt.debtValue ?? 0,
            nationalId: debt.nationalId ?? '',
          }
        }),
        total: answers.business.businessDebts?.total ?? 0,
      },
      businessTotal: answers.business.businessTotal ?? 0,
    },
    confirmAction: answers.confirmAction,
    debts: {
      debtsTotal: answers.debts.debtsTotal ?? 0,
      domesticAndForeignDebts: {
        data: (answers.debts.domesticAndForeignDebts?.data ?? []).map(
          (debt) => {
            return {
              loanIdentity: debt.loanIdentity ?? '',
              balance: debt.balance ?? 0,
              creditorName: debt.creditorName ?? '',
              nationalId: debt.nationalId ?? '',
            }
          },
        ),
        total: answers.debts.domesticAndForeignDebts?.total ?? 0,
      },
      publicCharges: (answers.debts.publicCharges ?? 0).toString(),
    },
    funeralCost: {
      buildCost: answers?.funeralCost?.buildCost ?? '',
      cremationCost: answers?.funeralCost?.cremationCost ?? '',
      printCost: answers?.funeralCost?.printCost ?? '',
      flowerCost: answers?.funeralCost?.flowerCost ?? '',
      musicCost: answers?.funeralCost?.musicCost ?? '',
      rentCost: answers?.funeralCost?.rentCost ?? '',
      foodAndDrinkCost: answers?.funeralCost?.foodAndDrinkCost ?? '',
      tombstoneCost: answers?.funeralCost?.tombstoneCost ?? '',
      otherCostQuestion: answers?.funeralCost?.otherCostQuestion ?? '',
      otherCost: answers?.funeralCost?.otherCost ?? '',
      otherCostDetails: answers?.funeralCost?.otherCostDetails ?? '',
      funeralCostAmount: answers?.funeralCost?.funeralCostAmount ?? '',
    },
    heirs: {
      data: (answers.heirs?.data ?? []).map((heir) => {
        return {
          ...heir,
          email: heir.email ?? '',
          heirsName: heir.name ?? '',
          heirsPercentage: heir.heirsPercentage ?? '',
          phone: heir.phone ?? '',
          relation: heir.relation ?? '',
          nationalId: heir.nationalId ?? '',
          inheritance: heir.inheritance ?? '',
          inheritanceTax: heir.inheritanceTax ?? '',
          taxableInheritance: heir.taxableInheritance ?? '',
          taxFreeInheritance: heir.taxFreeInheritance ?? '',
          dateOfBirth: heir.dateOfBirth ?? '',
          enabled: heir.enabled ?? true,
          advocate: {
            address: '',
            email: heir.advocate?.email ?? '',
            name: heir.advocate?.name ?? '',
            nationalId: heir.advocate?.nationalId ?? '',
            phone: heir.advocate?.phone ?? '',
          },
        }
      }),
      total: answers.heirs?.total ?? 0,
    },
    totalDeduction: answers.totalDeduction ?? 0,
    heirsAdditionalInfo: answers.heirsAdditionalInfo ?? '',
  }
}
