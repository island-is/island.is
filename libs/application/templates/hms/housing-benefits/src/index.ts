import template from './lib/template'

export const getFields = () => import('./fields')

export default template

export * from './utils/assigneeUtils'
export * from './utils/assigneeRejectionUtils'
export { LegalDomicileOption } from './utils/constants'
export * from './lib/messages'
