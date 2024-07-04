import template from './lib/HouseholdSupplementTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export default template

export * from './lib/householdSupplementUtils'
export * from './lib/messages'
export * from './lib/constants'
export * from './types'
