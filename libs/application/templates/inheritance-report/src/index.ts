import InheritanceReportTemplate from './lib/InheritanceReportTemplate'
export const getFields = () => import('./fields')

export { inheritanceReportSchema } from './lib/dataSchema'
export { nationalIdsMatch } from './lib/utils/helpers'
export { DebtTypes } from './types'
export default InheritanceReportTemplate
