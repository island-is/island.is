import { UberChart } from './uber-chart'
import { PostgresInfo, Service } from './types/input-types'
import { getDependantServices, resolveWithMaxLength } from './serialize-to-yaml'
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
    feature,
    ...services,
  )
  const securityContext = {
    privileged: false,
    allowPrivilegeEscalation: false,
  }
  const containers = featureSpecificServices
    .flatMap((service) =>
      service.serviceDef.infraResource.flatMap((r) =>
        r.featureDeploymentProvisionManifest(uberChart, service, image),
      ),
    )
    .reduce((acc, cur) => {
      let result = acc
      if (result.map((a) => a.name).indexOf(cur.name) === -1) {
        result = result.concat([cur])
      }
      return result
    }, [] as FeatureKubeJob['spec']['template']['spec']['containers'])
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
