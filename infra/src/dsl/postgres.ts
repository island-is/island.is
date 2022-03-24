import {
  EnvironmentVariables,
  InfrastructureResource,
  PostgresInfo,
  Secrets,
  Service,
  ServiceDefinition,
} from './types/input-types'
import { UberChartType } from './types/charts'
import { resolveVariable } from './serialize-environment-variables'

const postgresIdentifier = (id: string) => id.replace(/[\W\s]/gi, '_')
const resolveDbHost = (
  postgres: PostgresInfo,
  uberChart: UberChartType,
  service: Service,
) => {
  if (postgres.host) {
    const resolved = resolveVariable(
      postgres.host?.[uberChart.env.type],
      uberChart,
      service,
    )
    switch (resolved.type) {
      case 'error': {
        throw new Error()
        break
      }
      case 'success': {
        return { writer: resolved.value, reader: resolved.value }
      }
    }
  } else {
    return {
      writer: uberChart.env.auroraHost,
      reader: uberChart.env.auroraReplica ?? uberChart.env.auroraHost,
    }
  }
}

export class Postgres implements InfrastructureResource {
  env: { [name: string]: string } = {}
  secrets: { [name: string]: string } = {}

  featureDeploymentCleanup(): Promise<void> {
    return Promise.resolve(undefined)
  }

  featureDeploymentConfig(): object[] {
    return []
  }

  featureDeploymentProvision(): Promise<void> {
    return Promise.resolve(undefined)
  }

  constructor(private postgres?: PostgresInfo) {}

  prodDeploymentConfig(
    serviceDef: ServiceDefinition,
    uberChart: UberChartType,
    service: Service,
  ): {
    env: { [p: string]: string }
    secrets: { [p: string]: string }
    errors: string[]
  } {
    const withDefaults = (pi: PostgresInfo): PostgresInfo => {
      return {
        host: pi.host,
        username: pi.username ?? postgresIdentifier(serviceDef.name),
        passwordSecret:
          pi.passwordSecret ?? `/k8s/${serviceDef.name}/DB_PASSWORD`,
        name: pi.name ?? postgresIdentifier(serviceDef.name),
      }
    }

    const postgres = withDefaults(this.postgres ?? {})
    const env: { [name: string]: string } = {}
    const secrets: { [name: string]: string } = {}
    const errors: string[] = []
    env['DB_USER'] = postgres.username ?? postgresIdentifier(serviceDef.name)
    env['DB_NAME'] = postgres.name ?? postgresIdentifier(serviceDef.name)
    try {
      const { reader, writer } = resolveDbHost(postgres, uberChart, service)
      env['DB_HOST'] = writer
      env['DB_REPLICAS_HOST'] = reader
    } catch (e) {
      errors.push(
        `Could not resolve DB_HOST variable for service: ${serviceDef.name}`,
      )
    }
    secrets['DB_PASS'] =
      postgres.passwordSecret ?? `/k8s/${serviceDef.name}/DB_PASSWORD`
    return { env, secrets, errors }
  }
}
