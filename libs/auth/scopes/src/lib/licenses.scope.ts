export enum LicenseScope {
  // Client can read all licenses
  read = '@island.is/licenses:read',

  // Client can generate licenses to display (e.g. pkpass for drivers license)
  generate = '@island.is/licenses:generate',

  // Client can verify generated licenses
  verify = '@island.is/licenses:verify',
}
