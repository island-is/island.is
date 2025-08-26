import template from './lib/ActivationAllowanceTemplate'

export * from './lib/dataSchema'
export { serviceErrors as errorMsgs } from './lib/messages'

export const getFields = () => import('./fields')

export default template
