import { Dependency } from '../app/dataTypes/dependency.model'

export const filterDependency = (
  dependencies: Dependency[] | undefined,
  id: string | string[],
): Dependency[] => {
  if (!dependencies) return []

  if (Array.isArray(id)) {
    return dependencies
      .filter((dep) => !id.includes(dep.parentProp))
      .map((dep) => ({
        ...dep,
        childProps: dep.childProps?.filter((child) => !id.includes(child)),
      }))
      .filter((dep) => dep.childProps?.length > 0)
  }

  return dependencies
    .filter((dep) => dep.parentProp !== id)
    .map((dep) => ({
      ...dep,
      childProps: dep.childProps?.filter((child) => child !== id),
    }))
    .filter((dep) => dep.childProps?.length > 0)
}

export const filterOnlyParents = (
  dependencies: Dependency[] | undefined,
  ids: string | string[],
): Dependency[] => {
  if (!dependencies) return []

  if (Array.isArray(ids)) {
    return dependencies.filter((dep) => !ids.includes(dep.parentProp))
  }
  return dependencies.filter((dep) => dep.parentProp !== ids)
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
