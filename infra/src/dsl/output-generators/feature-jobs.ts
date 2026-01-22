import { ServiceDefinitionForEnv } from '../types/input-types'
import { getPostgresExtensions, resolveDbHost } from './map-to-helm-values'
import { FeatureKubeJob } from '../types/output-types'
import { resolveWithMaxLength } from './serialization-helpers'
import { EnvironmentConfig } from '../types/charts'

export const generateJobsForFeature = async (
  image: string,
  services: ServiceDefinitionForEnv[],
  env: EnvironmentConfig,
): Promise<FeatureKubeJob> => {
  const feature = env.feature
  if (typeof feature === 'undefined') {
    throw new Error('Feature jobs with a feature name not defined')
  }
  const securityContext = {
    privileged: false,
    allowPrivilegeEscalation: false,
  }
  const containers = Object.values(services)
    .map((service) =>
      [service.postgres, service.initContainers?.postgres]
        .filter((id) => id)
        .map((info) => {
          const host = resolveDbHost(service, env, info?.host)
          const extensions = getPostgresExtensions(
            service.initContainers?.postgres?.extensions,
          )
          return {
            command: ['/app/create-db.sh'],
            image,
            name: `${info!.username!.replace(/_/g, '-').substring(0, 60)}1`,
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
                value: info!.username!,
              },
              {
                name: 'DB_NAME',
                value: info!.name!,
              },
              {
                name: 'DB_PASSWORD_KEY',
                value: info!.passwordSecret!,
              },
              {
                name: 'DB_EXTENSIONS',
                value: extensions,
              },
            ],
          }
        }),
    )
    .reduce((acc, cur) => {
      let result = acc
      cur.forEach((c) => {
        if (result.map((a) => a.name).indexOf(c.name) === -1) {
          result = result.concat([c])
        }
      })
      return result
    }, [])
  return {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: resolveWithMaxLength(
        `create-db-${feature}-${new Date().getTime()}`,
        62,
      ),
    },
    spec: {
      template: {
        spec: {
          serviceAccountName: 'feature-deployment',
          containers,
          restartPolicy: 'Never',
        },
      },
    },
  }
}

export const generateCleanUpForFeature = async (
  image: string,
  services: ServiceDefinitionForEnv[],
  env: EnvironmentConfig,
): Promise<FeatureKubeJob> => {
  const feature = env.feature
  if (!feature) {
    throw new Error('Feature jobs with a feature name not defined')
  }
  const securityContext = {
    privileged: false,
    allowPrivilegeEscalation: false,
  }
  const containers = Object.values(services)
    .map((service) =>
      [service.postgres, service.initContainers?.postgres]
        .filter((id) => id)
        .map((info) => {
          const host = resolveDbHost(service, env, info?.host)
          const feature = env.feature
          const extensions = getPostgresExtensions(
            service.initContainers?.postgres?.extensions,
          )

          return {
            image,
            command: [`/app/destroy-dbs.sh`, feature as string],
            name: `${info!.username!.replace(/_/g, '-').substring(0, 60)}1`,
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
                value: info!.username!,
              },
              {
                name: 'DB_NAME',
                value: info!.name!,
              },
              {
                name: 'DB_PASSWORD_KEY',
                value: info!.passwordSecret!,
              },
              {
                name: 'DB_EXTENSIONS',
                value: extensions,
              },
            ],
          }
        })
        .concat([
          {
            image,
            command: [`/app/delete-secrets.sh`, feature as string],
            name: `${feature}-delete-secrets1`
              .replace(/_/g, '-')
              .substring(0, 60),
            securityContext,
            env: [],
          },
        ]),
    )
    .reduce((acc, cur) => {
      let result = acc
      cur.forEach((c) => {
        if (result.map((a) => a.name).indexOf(c.name) === -1) {
          result = result.concat([c])
        }
      })
      return result
    }, [])

  return {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: resolveWithMaxLength(
        `destroy-fd-${feature}-${new Date().getTime()}`,
        62,
      ),
      annotations: {
        'argocd.argoproj.io/hook': 'PostDelete',
        'argocd.argoproj.io/hook-delete-policy': 'BeforeHookCreation',
      },
    },
    spec: {
      template: {
        spec: {
          serviceAccountName: 'feature-deployment',
          containers,
          restartPolicy: 'Never',
        },
      },
    },
  }
}
