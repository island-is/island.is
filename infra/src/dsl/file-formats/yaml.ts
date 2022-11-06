import { dump, load } from 'js-yaml'
import {
  FeatureKubeJob,
  HelmValueFile,
  ServiceHelm,
} from '../types/output-types'
import { Kubernetes } from '../kubernetes-runtime'

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
export const dumpServiceHelm = (ch: Kubernetes, valueFile: HelmValueFile) => {
  const { namespaces, services } = valueFile
  const namespaceLabels = ch.env.feature ? { namespaceType: 'feature' } : {}
  return dump(
    { namespaces: { namespaces, labels: namespaceLabels }, ...services },
    dumpOpts,
  )
}
