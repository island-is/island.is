import template from './lib/template'

export const getFields = () => import('./fields/')

export { dataSchema } from './lib/dataSchema'
export type { ApplicationAnswers } from './lib/dataSchema'
export { ChiefExecutiveGender } from './utils/types'

export default template
