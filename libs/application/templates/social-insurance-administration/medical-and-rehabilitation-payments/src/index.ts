import template from './lib/MedicalAndRehabilitationPaymentsTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export default template

export * from './utils/medicalAndRehabilitationPaymentsUtils'
export * from './lib/messages'
