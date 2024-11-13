export const enableAppCompatibilityMode = (
  version?: string,
  versionToCompare?: string,
): boolean => {
  if (!version || !versionToCompare) {
    return false
  }

  const isVersionLater = version.localeCompare(versionToCompare, undefined, {
    numeric: true,
    sensitivity: 'base',
  })

  return isVersionLater > 0
}
