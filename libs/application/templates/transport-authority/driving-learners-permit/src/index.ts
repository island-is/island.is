import DrivingLearnersPermitTemplate from './lib/DrivingLearnersPermitTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export * from './lib/messages'

export default DrivingLearnersPermitTemplate
