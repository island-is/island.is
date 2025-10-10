import { Charts, ChartName, Deployments } from '../uber-charts/all-charts'
import { renderHelmServiceFile } from '../dsl/exports/helm'
import type { ServiceBuilder } from '../dsl/dsl'
import type { EnvironmentServices } from '../dsl/types/charts'
import type { OpsEnv } from '../dsl/types/input-types'
import { Envs } from '../environments'

const ENV_PRIORITY: OpsEnv[] = ['dev', 'staging', 'prod']

export type ServiceVariant = {
  chart: ChartName
  opsEnv: OpsEnv
  habitat: ServiceBuilder<any>[]
  service: ServiceBuilder<any>
}

export type ServiceCatalogEntry = {
  name: string
  variants: Partial<Record<OpsEnv, ServiceVariant>>
}

export const buildServiceCatalog = (): Map<string, ServiceCatalogEntry> => {
  const catalog = new Map<string, ServiceCatalogEntry>()

  const chartEntries = Object.entries(Charts) as [
    ChartName,
    EnvironmentServices,
  ][]

  chartEntries.forEach(([chartName, environmentServices]) => {
    ENV_PRIORITY.forEach((opsEnv) => {
      const habitat = environmentServices[opsEnv] ?? []
      habitat.forEach((serviceBuilder) => {
        const serviceName = serviceBuilder.name()
        let entry = catalog.get(serviceName)
        if (!entry) {
          entry = { name: serviceName, variants: {} }
          catalog.set(serviceName, entry)
        }
        entry.variants[opsEnv] = {
          chart: chartName,
          habitat,
          opsEnv,
          service: serviceBuilder,
        }
      })
    })
  })

  return catalog
}

export const listServiceNames = (
  catalog: Map<string, ServiceCatalogEntry> = buildServiceCatalog(),
): string[] => Array.from(catalog.keys()).sort((a, b) => a.localeCompare(b))

export const resolveServiceVariant = (
  serviceName: string,
  catalog: Map<string, ServiceCatalogEntry> = buildServiceCatalog(),
  preferredEnv?: OpsEnv,
): ServiceVariant => {
  const entry = catalog.get(serviceName)
  if (!entry) {
    throw new Error(`Service "${serviceName}" not found in DSL`)
  }

  if (preferredEnv) {
    const variant = entry.variants[preferredEnv]
    if (variant) {
      return variant
    }
    const available = Object.keys(entry.variants)
      .sort()
      .join(', ') || 'none'
    throw new Error(
      `Service "${serviceName}" not available in environment "${preferredEnv}". Available environments: ${available}`,
    )
  }

  for (const env of ENV_PRIORITY) {
    const variant = entry.variants[env]
    if (variant) {
      return variant
    }
  }

  const fallback = Object.values(entry.variants).find(
    (variant): variant is ServiceVariant => Boolean(variant),
  )

  if (!fallback) {
    throw new Error(`Service "${serviceName}" has no configured environments`)
  }

  return fallback
}

export const collectEnvVarNames = async (
  serviceName: string,
  options: { env?: OpsEnv } = {},
  catalog?: Map<string, ServiceCatalogEntry>,
): Promise<{ variables: string[]; context: ServiceVariant }> => {
  const activeCatalog = catalog ?? buildServiceCatalog()
  const variant = resolveServiceVariant(
    serviceName,
    activeCatalog,
    options.env,
  )

  const deployment = Deployments[variant.chart]
  if (!deployment) {
    throw new Error(
      `No deployment configuration found for chart "${variant.chart}"`,
    )
  }

  const envConfigKey = deployment[variant.opsEnv]
  const envConfig = envConfigKey && Envs[envConfigKey]

  if (!envConfig) {
    throw new Error(
      `Environment configuration missing for chart "${variant.chart}" (${variant.opsEnv})`,
    )
  }

  const helmValueFile = await renderHelmServiceFile(
    envConfig,
    variant.habitat,
    variant.habitat,
    'no-mocks',
  )

  const helmService = helmValueFile.services[variant.service.name()]

  if (!helmService) {
    const available = Object.keys(helmValueFile.services).sort().join(', ')
    throw new Error(
      `Rendered service "${variant.service.name()}" not found (available: ${available})`,
    )
  }

  const envVarNames = new Set<string>()

  Object.keys(helmService.env ?? {}).forEach((name) => envVarNames.add(name))
  Object.keys(helmService.secrets ?? {}).forEach((name) =>
    envVarNames.add(name),
  )

  return {
    variables: Array.from(envVarNames).sort((a, b) => a.localeCompare(b)),
    context: variant,
  }
}
