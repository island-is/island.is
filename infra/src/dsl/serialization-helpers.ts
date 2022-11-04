import {
  EnvironmentVariablesForEnv,
  Service,
  ValueSource,
} from './types/input-types'
import { DeploymentRuntime } from './types/charts'
import { ContainerEnvironmentVariables } from './types/output-types'

export function serializeValueSource(
  value: ValueSource,
  deployment: DeploymentRuntime,
  service: Service,
): { type: 'success'; value: string } {
  const result =
    typeof value === 'string'
      ? value
      : value({
          env: deployment.env,
          featureDeploymentName: deployment.env.feature,
          svc: (dep) => deployment.ref(service, dep),
        })
  return { type: 'success', value: result }
}

export function serializeEnvironmentVariables(
  service: Service,
  deployment: DeploymentRuntime,
  envs: EnvironmentVariablesForEnv,
): { envs: ContainerEnvironmentVariables } {
  return Object.entries(envs).reduce(
    (acc, [name, value]) => {
      const r = serializeValueSource(value, deployment, service)
      switch (r.type) {
        case 'success':
          return {
            envs: {
              ...acc.envs,
              [name]: r.value,
            },
          }
      }
    },
    { envs: {} as ContainerEnvironmentVariables },
  )
}

export const postgresIdentifier = (id: string) => id.replace(/[\W\s]/gi, '_')
