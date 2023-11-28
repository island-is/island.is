import CarRecyclingTemplate from './lib/CarRecyclingTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields/')

export default CarRecyclingTemplate

export * from './lib/carRecyclingUtils'
export * from './lib/messages'
