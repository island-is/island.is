import { Kubernetes } from './kubernetes'
import { Service } from './types/input-types'
import { getWithDependantServices } from './process-services'
import { resolveDbHost } from './map-to-helm-values'
import { FeatureKubeJob } from './types/output-types'
import {
  getPostgresInfoForFeature,
  resolveWithMaxLength,
} from './feature-deployments'

export const generateJobsForFeature = (
  uberChart: Kubernetes,
  habitat: Service[],
  image: string,
  ...services: Service[]
): FeatureKubeJob => {
  const feature = uberChart.env.feature
  if (typeof feature === 'undefined') {
    throw new Error('Feature jobs with a feature name not defined')
  }
  const featureSpecificServices = getWithDependantServices(
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
          const host = resolveDbHost(
            uberChart,
            service,
            info?.host?.[uberChart.env.type],
          )
          return {
            command: ['/app/create-db.sh'],
            image,
            name: `${info!.name!.replace(/_/g, '-').substr(0, 60)}1`,
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
      image: 'public.ecr.aws/runecast/busybox:1.35.0',
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
