import IdCardTemplate from './lib/IdCardTemplate'
import { IdCard } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export type IdCardAnswers = IdCard

export * from './utils'
export * from './shared/types'

export default IdCardTemplate
