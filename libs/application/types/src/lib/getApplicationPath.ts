import { ApplicationConfigurations, ApplicationTypes } from './ApplicationTypes'

/**
 * Client path (no leading slash) where an application is served. SDF-type
 * applications are rendered by `application-system-next`, which is mounted
 * under `/umsoknir/sdf`; everything else is the legacy SPA under `/umsoknir`.
 */
export const getApplicationPath = (
  type: ApplicationTypes,
  id: string,
): string => {
  const config = ApplicationConfigurations[type]
  const base = config?.useSdf ? 'umsoknir/sdf' : 'umsoknir'
  return `${base}/${config?.slug}/${id}`
}
