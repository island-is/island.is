import template from './lib/template'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export type {
  HomeLodging,
  HomeLodgingYear,
  OvernightStayDateRange,
  OvernightStayMonth,
  OvernightStaySubmission,
  OvernightStaySubmissionResponse,
} from './lib/types'
export {
  buildSubmissionPayload,
  getHomeLodgingYear,
} from './utils/homeLodgings'

export default template
