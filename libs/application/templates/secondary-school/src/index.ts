import template from './lib/SecondarySchoolTemplate'
import { SecondarySchool } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type SecondarySchoolAnswers = SecondarySchool

export * from './shared'
export * from './lib/messages/error'

export default template
