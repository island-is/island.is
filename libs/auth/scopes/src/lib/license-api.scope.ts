export enum LicenseApiScope {
  licensesVerify = '@island.is/licenses:verify',
  licensesFirearm = '@island.is/licenses:firearm',
  licensesDisability = '@island.is/licenses:disability',
}

export const getLicenseTypeScopes = (): Array<LicenseApiScope> => [
  LicenseApiScope.licensesFirearm,
  LicenseApiScope.licensesDisability,
]
