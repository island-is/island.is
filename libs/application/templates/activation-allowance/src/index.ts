import template from './lib/ActivationAllowanceTemplate'
export * from './lib/dataSchema'
export { serviceErrors as errorMsgs } from './lib/messages'
export { IncomeCheckboxValues } from './utils/enums'
export const getFields = () => import('./fields')

export default template
