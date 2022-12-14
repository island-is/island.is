import InheritanceReportTemplate from './lib/InheritanceReportTemplate'
import { inheritanceReportSchema } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export default InheritanceReportTemplate
export { inheritanceReportSchema }
