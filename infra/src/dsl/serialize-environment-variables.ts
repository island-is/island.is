import {
  EnvironmentVariables,
  EnvironmentVariableValue,
  MissingSetting,
  Service,
  ValueType,
} from './types/input-types'
import { UberChartType } from './types/charts'
import { ContainerEnvironmentVariables } from './types/output-types'

function serializeValueType(
  value: ValueType,
  uberChart: UberChartType,
  service: Service,
): { type: 'error' } | { type: 'success'; value: string } {
  if (value === MissingSetting) return { type: 'error' }
  const result =
    typeof value === 'string'
      ? value
      : value({
          env: uberChart.env,
          featureName: uberChart.env.feature,
          svc: (dep) => uberChart.ref(service, dep),
        })
  return { type: 'success', value: result }
}

export function serializeEnvironmentVariables(
  service: Service,
  uberChart: UberChartType,
  envs: EnvironmentVariables,
): { errors: string[]; envs: ContainerEnvironmentVariables } {
  return Object.entries(envs).reduce(
    (acc, [name, value]) => {
      const r = resolveVariable(value, uberChart, service)
      switch (r.type) {
        case 'error':
          return {
            errors: acc.errors.concat([
              `Missing settings for service ${service.serviceDef.name} in env ${uberChart.env.type}. Keys of missing settings: ${name}`,
            ]),
            envs: acc.envs,
          }
        case 'success':
          return {
            errors: acc.errors,
            envs: {
              ...acc.envs,
              [name]: r.value,
            },
          }
      }
    },
    { errors: [] as string[], envs: {} as ContainerEnvironmentVariables },
  )
}

export function resolveVariable(
  value: EnvironmentVariableValue,
  uberChart: UberChartType,
  service: Service,
) {
  return typeof value === 'object'
    ? serializeValueType(value[uberChart.env.type], uberChart, service)
    : serializeValueType(value, uberChart, service)
}
