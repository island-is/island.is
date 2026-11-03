import DrivingAssessmentApprovalTemplate from './lib/DrivingAssessmentApprovalTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export * from './lib/messages'

export default DrivingAssessmentApprovalTemplate
