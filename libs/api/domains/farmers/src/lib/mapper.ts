import {
  AssetOwner,
  BeneficiaryWrapper,
  Farm,
  Payment,
} from '@island.is/clients/farmers'
import { FarmerLand } from './models/farmerLand.model'
import { FarmerLandSubsidy } from './models/farmerLandSubsidy.model'
import { LandBeneficiary } from './models/landBeneficiary.model'
import { LandBeneficiaryPayment } from './models/landBeneficiaryPayment.model'
import { LandRegistryEntry } from './models/landRegistryEntry.model'
import { isDefined } from '@island.is/shared/utils'

export const mapToFarmerLandCollection = (farmlands: Farm[]): FarmerLand[] => {
  return farmlands.map(mapToFarmerLand).filter(isDefined)
}

export const mapToFarmerLand = (farm: Farm): FarmerLand | undefined => {
  if (!farm.farmId || !farm.farmName) {
    return undefined
  }

  return {
    id: farm.farmId,
    name: farm.farmName,
  }
}

export const mapToLandBeneficiaryPayment = (
  p: NonNullable<BeneficiaryWrapper['list']>[number],
): LandBeneficiaryPayment => ({
  categoryId: p.paymentCategoryId ?? 0,
  category: p.paymentCategory ?? undefined,
  share: p.share ? parseFloat(p.share) : undefined,
  blocked: p.paymentStop?.toLowerCase() === 'já',
  operating: p.operating?.toLowerCase() === 'í rekstri',
  dateFrom: p.from ?? undefined,
  dateTo: p.to ?? undefined,
})

export const mapToFarmerLandSubsidy = (
  p: Payment,
  farmId: string,
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

export const mapToLandBeneficiary = (
  wrapper: BeneficiaryWrapper,
): LandBeneficiary | undefined => {
  const name = wrapper.details?.beneficiaryName
  if (!name) return undefined
  return {
    name,
    nationalId: wrapper.details?.beneficiaryNationalId ?? undefined,
    bankInfo: wrapper.details?.beneficiaryBankInfo ?? undefined,
    isat: wrapper.details?.beneficiaryIsat ?? undefined,
    vskNumberDisplayString: wrapper.details?.beneficiaryVsk ?? undefined,
    payments: (wrapper.list ?? []).map(mapToLandBeneficiaryPayment),
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
    properties: (owner.list ?? []).map((a) => ({
      ownershipType: a.ownerType ?? undefined,
      usage: a.usage ?? undefined,
      share: a.share ? parseFloat(a.share) : undefined,
    })),
  }
}
