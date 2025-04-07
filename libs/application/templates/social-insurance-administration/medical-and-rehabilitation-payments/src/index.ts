import template from './lib/MedicalAndRehabilitationPaymentsTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export default template

export * from './lib/medicalAndRehabilitationPaymentsUtils'
export * from './lib/messages'
