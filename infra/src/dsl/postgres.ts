import {
  InfrastructureResource,
  PostgresInfo,
  Service,
  ServiceDefinition,
} from './types/input-types'
import { UberChart } from './uber-chart'

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

  featureDeploymentProvisionManifest(
    uberChart: UberChart,
    service: Service,
    image: string,
  ) {
    const host = resolveDbHost(this.postgres!, uberChart, service)
    const securityContext = {
      privileged: false,
      allowPrivilegeEscalation: false,
    }
    return [
      {
        command: ['/app/create-db.sh'],
        image,
        name: `${this.postgres!.name!.replace(/_/g, '-').substr(0, 60)}1`,
        securityContext,
        env: [
          {
            name: 'PGHOST',
            value: host.writer,
          },
          {
            name: 'PGDATABASE',
            value: 'postgres',
          },
          {
            name: 'PGUSER',
            value: 'root',
          },
          {
            name: 'PGPASSWORD_KEY',
            value: '/rds/vidspyrna/masterpassword',
          },
          {
            name: 'DB_USER',
            value: this.postgres!.username!,
          },
          {
            name: 'DB_NAME',
            value: this.postgres!.name!,
          },
          {
            name: 'DB_PASSWORD_KEY',
            value: this.postgres!.passwordSecret!,
          },
        ],
      },
    ]
  }

  constructor(private postgres?: PostgresInfo) {}

  prodDeploymentConfig(
    serviceDef: ServiceDefinition,
    uberChart: UberChartType,
    service: Service,
    featureDeployment?: string,
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
    ;(env['DB_USER'] = this.getDbName(
      postgres.username ?? postgresIdentifier(serviceDef.name),
      featureDeployment,
    )),
      (env['DB_NAME'] = this.getDbName(
        postgres.name ?? postgresIdentifier(serviceDef.name),
        featureDeployment,
      ))
    try {
      const { reader, writer } = resolveDbHost(postgres, uberChart, service)
      env['DB_HOST'] = writer
      env['DB_REPLICAS_HOST'] = reader
    } catch (e) {
      errors.push(
        `Could not resolve DB_HOST variable for service: ${serviceDef.name}`,
      )
    }
    secrets['DB_PASS'] = this.getDbPassword(
      postgres.passwordSecret ?? `/k8s/${serviceDef.name}/DB_PASSWORD`,
      featureDeployment,
    )
    return { env, secrets, errors }
  }

  private getDbName(name: string, featureDeployment?: string) {
    return resolveWithMaxLength(
      featureDeployment
        ? `feature_${postgresIdentifier(featureDeployment)}_${name}`
        : name,
      60,
    )
  }

  private getDbPassword(
    password: string,
    featureDeployment: string | undefined,
  ) {
    return featureDeployment
      ? password.replace('/k8s/', `/k8s/feature-${featureDeployment}-`)
      : password
  }
}
const resolveWithMaxLength = (str: string, max: number) => {
  if (str.length > max) {
    return `${str.substr(0, Math.ceil(max / 3))}${str.substr((-max / 3) * 2)}`
  }
  return str
}
