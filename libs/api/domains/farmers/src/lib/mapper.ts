import { BeneficiaryWrapper, Farm } from '@island.is/clients/farmers'
import { FarmerLand } from './models/farmerLand.model'
import { LandBeneficiary } from './models/landBeneficiary.model'
import { LandBeneficiaryPayment } from './models/landBeneficiaryPayment.model'
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

export const mapToLandBeneficiary = (
  wrapper: BeneficiaryWrapper,
): LandBeneficiary => ({
  name: wrapper.details?.beneficiaryName ?? undefined,
  nationalId: wrapper.details?.beneficiaryNationalId ?? undefined,
  bankInfo: wrapper.details?.beneficiaryBankInfo ?? undefined,
  isat: wrapper.details?.beneficiaryIsat ?? undefined,
  vskNumberDisplayString: wrapper.details?.beneficiaryVsk ?? undefined,
  payments: (wrapper.list ?? []).map(mapToLandBeneficiaryPayment),
})
