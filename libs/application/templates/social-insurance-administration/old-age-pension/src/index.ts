import template from './lib/OldAgePensionTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export default template

export * from './utils/oldAgePensionUtils'
export * from './utils/conditionUtils'
export * from './lib/messages'
export * from './utils/constants'
export * from './utils/types'
