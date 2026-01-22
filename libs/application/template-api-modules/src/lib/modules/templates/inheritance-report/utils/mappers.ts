import { infer as zinfer } from 'zod'
import { inheritanceReportSchema } from '@island.is/application/templates/inheritance-report'

type InheritanceReportSchema = zinfer<typeof inheritanceReportSchema>

export const trueOrHasYes = (element: string | boolean): string => {
  const elementString = element.toString().toLowerCase()
  const value = elementString === 'yes' || elementString === 'true'
  return value.toString()
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
): Omit<InheritanceReportSchema, 'estateSelectionInfo'> & {
  caseNumber: string
} => {
  return {
    applicationFor: answers.applicationFor ?? '',
    applicant: answers.applicant,
    prePaidApplicant: answers.prePaidApplicant,
    prepaidInheritance: answers.prepaidInheritance,
    executors: {
      executor: {
        email: answers.executors?.executor.email ?? '',
        phone: answers.executors?.executor.phone ?? '',
        name: answers.executors?.executor.name ?? '',
        nationalId: answers.executors?.executor.nationalId ?? '',
      },
      spouse: {
        email: answers.executors?.spouse?.email ?? '',
        phone: answers.executors?.spouse?.phone ?? '',
        name: answers.executors?.spouse?.name ?? '',
        nationalId: answers.executors?.spouse?.nationalId ?? '',
      },
      includeSpouse: undefined,
    },
    approveExternalData: answers.approveExternalData,
    assets: {
      assetsTotal: answers.assets.assetsTotal ?? 0,
      bankAccounts: {
        data: (answers.assets.bankAccounts?.data ?? []).map((account) => {
          return {
            assetNumber: account.assetNumber ?? '',
            propertyValuation: account.propertyValuation ?? '0',
            exchangeRateOrInterest: account.exchangeRateOrInterest ?? '',
            foreignBankAccount: account?.foreignBankAccount ?? [],
            deceasedShare: account.deceasedShare ?? '0',
            deceasedShareEnabled: account.deceasedShareEnabled ?? [],
            deceasedShareAmount: account.deceasedShareAmount ?? 0,
            enabled: account.enabled ?? true,
          }
        }),
        total: answers.assets.bankAccounts?.total ?? 0,
      },
      claims: {
        data: (answers.assets.claims?.data ?? []).map((claim) => {
          return {
            assetNumber: claim.assetNumber ?? '',
            description: claim.description ?? '',
            propertyValuation: claim.propertyValuation ?? '0',
            deceasedShare: claim.deceasedShare ?? '0',
            deceasedShareEnabled: claim.deceasedShareEnabled ?? [],
            deceasedShareAmount: claim.deceasedShareAmount ?? 0,
            enabled: claim.enabled ?? true,
          }
        }),
        total: answers.assets.claims?.total ?? 0,
      },
      guns: {
        data: (answers.assets.guns?.data ?? []).map((gun) => {
          return {
            assetNumber: gun.assetNumber ?? '',
            description: gun.description ?? '',
            propertyValuation: gun.propertyValuation ?? '0',
            deceasedShare: gun.deceasedShare ?? '0',
            deceasedShareEnabled: gun.deceasedShareEnabled ?? [],
            deceasedShareAmount: gun.deceasedShareAmount ?? 0,
            enabled: gun.enabled ?? true,
          }
        }),
        total: answers.assets.guns?.total ?? 0,
      },
      inventory: {
        info: answers.assets.inventory?.info ?? '',
        value: answers.assets.inventory?.value ?? '',
        deceasedShare: answers.assets.inventory?.deceasedShare ?? '0',
        deceasedShareEnabled:
          answers.assets.inventory?.deceasedShareEnabled ?? [],
        deceasedShareAmount: answers.assets.inventory?.deceasedShareAmount ?? 0,
      },
      money: {
        info: answers.assets.money?.info ?? '',
        value: answers.assets.money?.value ?? '',
        deceasedShare: answers.assets.money?.deceasedShare ?? '0',
        deceasedShareEnabled: answers.assets.money?.deceasedShareEnabled ?? [],
        deceasedShareAmount: answers.assets.money?.deceasedShareAmount ?? 0,
      },
      otherAssets: {
        data: (answers.assets.otherAssets?.data ?? []).map((otherAsset) => {
          return {
            info: otherAsset?.info ?? '',
            value: otherAsset?.value ?? '',
            deceasedShare: otherAsset?.deceasedShare ?? '0',
            deceasedShareEnabled: otherAsset?.deceasedShareEnabled ?? [],
            deceasedShareAmount: otherAsset?.deceasedShareAmount ?? 0,
          }
        }),
        total: answers.assets.otherAssets?.total ?? 0,
      },
      realEstate: {
        data: (answers.assets.realEstate?.data ?? []).map((realEstate) => {
          return {
            assetNumber:
              realEstate.assetNumber.replace('-', '').replace(/\D/g, '') ?? '',
            description: realEstate.description ?? '',
            propertyValuation: realEstate.propertyValuation ?? '0',
            share: realEstate.share ?? '0',
            deceasedShare: realEstate.deceasedShare ?? '0',
            deceasedShareEnabled: realEstate.deceasedShareEnabled ?? [],
            deceasedShareAmount: realEstate.deceasedShareAmount ?? 0,
            enabled: realEstate.enabled ?? true,
          }
        }),
        total: answers.assets.realEstate?.total ?? 0,
      },
      stocks: {
        data: (answers.assets.stocks?.data ?? []).map((stock) => {
          return {
            amount: stock.amount ?? '',
            assetNumber: stock.assetNumber ?? '',
            description: stock.description ?? '',
            exchangeRateOrInterest: stock.exchangeRateOrInterest ?? '',
            value: stock.value ?? '',
            deceasedShare: stock?.deceasedShare ?? '0',
            deceasedShareEnabled: stock?.deceasedShareEnabled ?? [],
            deceasedShareAmount: stock?.deceasedShareAmount ?? 0,
            enabled: stock.enabled ?? true,
          }
        }),
        total: answers.assets.stocks?.total ?? 0,
      },
      vehicles: {
        data: (answers.assets.vehicles?.data ?? []).map((vehicle) => {
          return {
            assetNumber: vehicle.assetNumber ?? '',
            description: vehicle.description ?? '',
            propertyValuation: vehicle.propertyValuation ?? '0',
            deceasedShare: vehicle.deceasedShare ?? '0',
            deceasedShareEnabled: vehicle.deceasedShareEnabled ?? [],
            deceasedShareAmount: vehicle?.deceasedShareAmount ?? 0,
            enabled: vehicle.enabled ?? true,
          }
        }),
        total: answers.assets.vehicles?.total ?? 0,
      },
    },
    caseNumber: answers.estateInfoSelection,
    confirmAction: answers.confirmAction,
    assetsConfirmation: answers.assetsConfirmation,
    debtsConfirmation: answers.debtsConfirmation,
    heirsConfirmation: answers.heirsConfirmation,
    debts: {
      debtsTotal: answers?.debts?.debtsTotal ?? 0,
      domesticAndForeignDebts: {
        data: (answers.debts?.domesticAndForeignDebts?.data ?? []).map(
          (debt) => {
            return {
              assetNumber: debt.assetNumber ?? '',
              propertyValuation: debt.propertyValuation ?? 0,
              description: debt.description ?? '',
              nationalId: debt.nationalId ?? '',
              debtType: debt.debtType ?? '',
            }
          },
        ),
        total: answers.debts?.domesticAndForeignDebts?.total ?? 0,
      },
      publicCharges: (answers.debts?.publicCharges ?? 0).toString(),
    },
    estateInfoSelection: answers.estateInfoSelection,
    funeralCost: {
      build: answers?.funeralCost?.build ?? '',
      cremation: answers?.funeralCost?.cremation ?? '',
      print: answers?.funeralCost?.print ?? '',
      flowers: answers?.funeralCost?.flowers ?? '',
      music: answers?.funeralCost?.music ?? '',
      rent: answers?.funeralCost?.rent ?? '',
      food: answers?.funeralCost?.food ?? '',
      tombstone: answers?.funeralCost?.tombstone ?? '',
      service: answers?.funeralCost?.service ?? '',
      hasOther: answers?.funeralCost?.hasOther ?? [],
      other: answers?.funeralCost?.other ?? '',
      otherDetails: answers?.funeralCost?.otherDetails ?? '',
      total: answers?.funeralCost?.total ?? '',
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
    spouse: {
      wasInCohabitation: answers?.spouse?.wasInCohabitation,
      hadSeparateProperty: answers?.spouse?.hadSeparateProperty,
      spouseTotalDeduction: answers?.spouse?.spouseTotalDeduction ?? 0,
      spouseTotalSeparateProperty:
        answers?.spouse?.spouseTotalSeparateProperty ?? '',
    },
    totalDeduction: answers.totalDeduction ?? 0,
    heirsAdditionalInfo: answers.heirsAdditionalInfo ?? '',

    total: answers.total ?? 0,
    debtsTotal: answers.debtsTotal ?? 0,
    shareTotal: answers.shareTotal ?? 0,
    netTotal: answers.netTotal ?? 0,
    spouseTotal: answers.spouseTotal ?? 0,
    estateTotal: answers.estateTotal ?? 0,
    netPropertyForExchange: answers.netPropertyForExchange ?? 0,
    customShare: {
      hasCustomSpouseSharePercentage:
        answers?.customShare?.hasCustomSpouseSharePercentage ?? 'No',
      customSpouseSharePercentage:
        answers?.customShare?.customSpouseSharePercentage ?? '50',
      deceasedWasMarried: answers?.customShare?.deceasedWasMarried ?? '',
      deceasedHadAssets: answers?.customShare?.deceasedHadAssets ?? '',
    },
  }
}
