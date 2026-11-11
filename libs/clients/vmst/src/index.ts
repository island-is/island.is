import type { ApplicationRight } from '../gen/fetch'

export { VMSTModule } from './lib/vmst.module'
export * from '../gen/fetch'
export * from './lib/vmst.config'
export { describeVmstErrorBody } from './lib/utils'
export { ApplicationInformationApi } from './lib/applicationInformationApi'
export type { ApplicationGetApplicationInformationRequest } from './lib/applicationInformationApi'

export type ApplicationRights = Omit<ApplicationRight, 'rightsUnit'> & {
  rightsUnit?: Exclude<ApplicationRight['rightsUnit'], null>
}
