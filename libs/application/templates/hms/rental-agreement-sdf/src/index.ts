import template from './lib/template'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => Promise.resolve({})

export * from './lib/dataSchema'
export * from './utils/constants'

export default template
