import template from './lib/DeathBenefitsTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default template

export * from './lib/deathBenefitsUtils'
export * from './lib/messages'
export * from './lib/constants'
export * from './types'
