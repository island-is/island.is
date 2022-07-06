export const branchNameToFeatureName = (branchName: string) => {
  const result = Array.from(branchName.toLowerCase())
    .filter((c) => c !== '/')
    .map((c) => (c < 'a' || c > 'z' ? '-' : c))
    .join('')
  return result
}
