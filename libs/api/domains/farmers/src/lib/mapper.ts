import {
  AssetOwner,
  BeneficiaryWrapper,
  Farm,
  Payment,
  PaginatedPayments,
  MappedBeneficiaryWrapper,
} from '@island.is/clients/farmers'
import { FarmerLand } from './models/farmerLand.model'
import { FarmerLandSubsidy } from './models/farmerLandSubsidy.model'
import { FarmerLandSubsidyFilterOptions } from './models/farmerLandSubsidyFilterOptions.model'
import { LandBeneficiary } from './models/landBeneficiary.model'
import { LandBeneficiaryPayment } from './models/landBeneficiaryPayment.model'
import { LandRegistryEntry } from './models/landRegistryEntry.model'
import { isDefined } from '@island.is/shared/utils'

export const mapToFarmerLandCollection = (farmlands: Farm[]): FarmerLand[] => {
  return farmlands.map(mapToFarmerLand).filter(isDefined)
}

export const mapToFarmerLand = (farm: Farm): FarmerLand | null => {
  if (!farm.farmId || !farm.farmName) {
    return null
  }

  return {
    id: farm.farmId.toString(),
    name: farm.farmName,
  }
}

export const mapToLandBeneficiaryPayment = (
  p: NonNullable<MappedBeneficiaryWrapper['list']>[number],
): LandBeneficiaryPayment | undefined => {
  if (!p.paymentCategoryId) {
    return undefined
  }
  return {
    categoryId: p.paymentCategoryId,
    category: p.paymentCategory ?? undefined,
    share: p.share ? parseFloat(p.share) : undefined,
    blocked: p.blocked,
    operating: p.operating,
    dateFrom: p.from ?? undefined,
    dateTo: p.to ?? undefined,
  }
}

export const mapToFarmerLandSubsidy = (
  p: Payment,
): FarmerLandSubsidy | undefined => {
  if (!p.id) return undefined
  return {
    id: p.id.toString(),
    paymentDate: p.paymentDate ?? undefined,
    nationalId: p.nationalId ?? undefined,
    name: p.name ?? undefined,
    contractId: p.contractId ?? undefined,
    contract: p.contract ?? undefined,
    paymentCategoryId: p.paymentCategoryId ?? undefined,
    paymentCategory: p.paymentCategory ?? undefined,
    unitPrice: p.unitPrice ?? undefined,
    units: p.units ?? undefined,
    grossAmount: p.grossAmount ?? undefined,
    netPaid: p.netPaid ?? undefined,
    offset: p.offset ?? undefined,
  }
}

export const mapToFilterOptions = (
  filterOptions: PaginatedPayments['filterOptions'],
): FarmerLandSubsidyFilterOptions | undefined => {
  if (!filterOptions) return undefined
  return {
    contracts: (filterOptions.contracts ?? []).flatMap((c) =>
      c.contractId && c.contractName
        ? [{ id: c.contractId, name: c.contractName }]
        : [],
    ),
    paymentCategories: (filterOptions.paymentCategories ?? []).flatMap((pc) =>
      pc.paymentCategoryId != null && pc.paymentCategoryName
        ? [{ id: pc.paymentCategoryId, name: pc.paymentCategoryName }]
        : [],
    ),
  }
}

export const mapToLandBeneficiary = (
  wrapper: MappedBeneficiaryWrapper,
): LandBeneficiary | undefined => {
  const name = wrapper.details?.beneficiaryName
  if (!name) return undefined
  return {
    name,
    nationalId: wrapper.details?.beneficiaryNationalId ?? undefined,
    bankInfo: wrapper.details?.beneficiaryBankInfo ?? undefined,
    isat: wrapper.details?.beneficiaryIsat ?? undefined,
    vatNumber: wrapper.details?.beneficiaryVsk ?? undefined,
    payments: (wrapper.list ?? [])
      .map(mapToLandBeneficiaryPayment)
      .filter(isDefined),
  }
}

export const mapToLandRegistryEntry = (
  owner: AssetOwner,
): LandRegistryEntry | undefined => {
  const id = owner.details?.farmId?.toString()
  const name = owner.details?.farmName
  if (!id || !name) return undefined
  return {
    id,
    name,
    nationalId: owner.details?.nationalId ?? undefined,
    properties: (owner.list ?? [])
      .map((a) => {
        if (!a.ownerType && !a.usage && a.share == null) return undefined
        return {
          ownershipType: a.ownerType ?? undefined,
          usage: a.usage ?? undefined,
          share: a.share ? parseFloat(a.share) : undefined,
        }
      })
      .filter(isDefined),
  }
}
