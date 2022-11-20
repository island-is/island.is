import { dump, load } from 'js-yaml'
import {
  FeatureKubeJob,
  HelmValueFile,
  LocalrunValueFile,
} from '../types/output-types'
import { Localhost } from '../localhost-runtime'
import { EnvironmentConfig } from '../types/charts'

export const dumpOpts = {
  sortKeys: true,
  noRefs: true,
  forceQuotes: true,
}
export const reformatYaml = (content: string): string => {
  const obj = load(content, { json: true })
  return dump(obj, dumpOpts)
}
export const dumpJobYaml = (job: FeatureKubeJob) => dump(job, dumpOpts)
export const dumpServiceHelm = (
  env: EnvironmentConfig,
  valueFile: HelmValueFile,
) => {
  const { namespaces, services } = valueFile
  const namespaceLabels = env.feature ? { namespaceType: 'feature' } : {}
  return dump(
    { namespaces: { namespaces, labels: namespaceLabels }, ...services },
    dumpOpts,
  )
}
export const dumpDockerCompose = (
  ch: Localhost,
  valueFile: LocalrunValueFile,
) => {
  const { services, mocks } = valueFile
  return dump({ ...services, ...mocks }, dumpOpts)
}
