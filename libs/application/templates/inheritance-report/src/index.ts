import InheritanceReportTemplate from './lib/InheritanceReportTemplate'
import { inheritanceReportSchema } from './lib/dataSchema'
import { m as messages } from './lib/messages'

export const getFields = () => import('./fields')

export default InheritanceReportTemplate
export { inheritanceReportSchema }
export { messages }
