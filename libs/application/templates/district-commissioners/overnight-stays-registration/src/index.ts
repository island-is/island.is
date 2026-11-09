import template from './lib/template'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export type {
  HomeLodgingRegistration,
  OvernightStayDateRange,
  OvernightStayMonth,
  OvernightStaySubmission,
  OvernightStaySubmissionResponse,
} from './lib/types'
export { buildSubmissionPayload } from './utils/homeLodgings'

export default template
