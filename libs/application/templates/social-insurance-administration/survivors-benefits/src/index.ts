import template from './lib/SurvivorsBenefitsTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default template

export * from './lib/survivorsBenefitsUtils'
export * from './lib/messages'
export * from './lib/constants'
