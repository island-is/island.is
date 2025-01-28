export const enableAppCompatibilityMode = (
  version?: string,
  versionToCompare?: string,
): boolean => {
  if (!version || !versionToCompare) {
    return false
  }

  const versionComparison = version.localeCompare(versionToCompare, undefined, {
    numeric: true,
    sensitivity: 'base',
  })

  return versionComparison <= 0
}
