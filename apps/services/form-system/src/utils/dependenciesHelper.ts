import { Dependency } from '../app/dataTypes/dependency.model'

export const filterDependency = (
  dependencies: Dependency[] | undefined,
  id: string,
): Dependency[] => {
  if (!dependencies) return []

  return dependencies
    .filter((dep) => dep.parentProp !== id)
    .map((dep) => ({
      ...dep,
      childProps: dep.childProps?.filter((child) => child !== id),
    }))
    .filter((dep) => dep.childProps?.length > 0)
}

export const filterArrayDependency = (
  dependencies: Dependency[] | undefined,
  ids: string[],
): Dependency[] => {
  if (!dependencies) return []

  return dependencies
    .filter((dep) => !ids.includes(dep.parentProp))
    .map((dep) => ({
      ...dep,
      childProps: dep.childProps?.filter((child) => !ids.includes(child)),
    }))
    .filter((dep) => dep.childProps?.length > 0)
}
