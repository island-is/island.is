export type LicenseType = 'Education' | 'Health' | 'DistrictCommissioners'

export const addLicenseTypePrefix = (id: string, type: LicenseType) => {
  switch (type) {
    case 'DistrictCommissioners':
      return 'D' + id
    case 'Education':
      return 'E' + id
    case 'Health':
      return 'H' + id
    default:
      throw new Error('Invalid license type')
  }
}

export const getLicenseTypeByIdPrefix = (
  id: string,
): { type: LicenseType; licenseId: string } | null => {
  let type: LicenseType | undefined

  if (id.startsWith('D')) {
    type = 'DistrictCommissioners'
  }
  if (id.startsWith('E')) {
    type = 'Education'
  }
  if (id.startsWith('H')) {
    type = 'Health'
  }

  if (!type) {
    return null
  }

  return { type, licenseId: id.substring(1) }
}
