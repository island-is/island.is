import template from './lib/SecondarySchoolTemplate'
import { SecondarySchool } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export * from './lib/messages'

export type SecondarySchoolAnswers = SecondarySchool

export * from './shared'

export default template
