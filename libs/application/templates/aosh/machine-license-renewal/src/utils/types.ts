export type MachineLicenseRight = {
  flokkur: string
  fulltHeiti: string
  stjorna: string
}

export type MachineLicenseRights = {
  licenseNumber: string
  renewableRights: MachineLicenseRight[]
  otherRights: MachineLicenseRight[]
}
