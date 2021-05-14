import { UberChart } from './uber-chart'
import { PostgresInfo, Service } from './types/input-types'
import {
  getDependantServices,
  getPostgresInfoForFeature,
} from './serialize-to-yaml'
import { resolveDbHost } from './map-to-values'
import { FeatureKubeJob } from './types/output-types'

export const generateJobsForFeature = (
  uberChart: UberChart,
  habitat: Service[],
  image: string,
  ...services: Service[]
): FeatureKubeJob => {
  const feature = uberChart.env.feature
  if (typeof feature === 'undefined') {
    throw new Error('Feature jobs with a feature name not defined')
  }
  const featureSpecificServices = getDependantServices(
    uberChart,
    habitat,
    ...services,
  )
  const securityContext = {
    privileged: false,
    allowPrivilegeEscalation: false,
  }
  const containers = featureSpecificServices
    .map((service) =>
      [
        getPostgresInfoForFeature(feature, service.serviceDef.postgres),
        getPostgresInfoForFeature(
          feature,
          service.serviceDef.initContainers?.postgres,
        ),
      ]
        .filter((id) => id)
        .map((info) => {
          const host = resolveDbHost(info!, uberChart, service)
          return {
            command: ['/app/create-db.sh'],
            image,
            name: info!.name!.replace(/_/g, '-').substr(0, 60),
            securityContext,
            env: [
              {
                name: 'PGHOST',
                value: host,
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
  if (containers.length === 0) {
    containers.push({
      name: 'noop',
      securityContext,
      image: 'busybox',
      command: [
        'sh',
        '-c',
        'echo "This is a noop container to make sure we always have at least one container!"',
      ],
      env: [],
    })
  }
  return {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: `create-db-${feature}-${new Date().getTime()}`,
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
