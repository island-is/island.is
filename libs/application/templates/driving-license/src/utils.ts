import { DrivingLicenseType } from './types/schema'

export const buildEntitlementOption = (
  entitlementTypes: DrivingLicenseType[],
  typeId: string,
) => {
  const type = entitlementTypes.find((item) => item.id === typeId)
  const typeName = (type && type.name) || ''
  return {
    value: typeId,
    label: `<span><b>${typeId}</b> ${typeName}</span>`,
  }
}

export type QualityPhotoData = {
  data: {
    qualityPhoto: string
    success: boolean
  }
}
