import capitalize from 'lodash/capitalize'

export const mapLicenseIdToLicenseType = (licenseId: string) =>
  `${capitalize(licenseId)}License`
