import { FormSystemDependency } from '@island.is/api/schema'

export const hasDependency = (
  dependencyArray:
    | (FormSystemDependency | null | undefined)[]
    | undefined
    | null,
  id: string,
) => {
  if (!dependencyArray) return false
  return dependencyArray.some((dependency) => {
    return dependency?.parentProp === id || dependency?.childProps?.includes(id)
  })
}
