import template from './lib/CitizenshipTemplate'
import { Citizenship } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export * from './lib/messages'

export type CitizenshipAnswers = Citizenship

export * from './utils'
export * from './shared/types'

export default template
