import DrivingSchoolConfirmationTemplate from './lib/DrivingSchoolConfirmationTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export * from './lib/messages'

export default DrivingSchoolConfirmationTemplate
