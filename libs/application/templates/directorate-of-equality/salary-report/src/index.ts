import template from './lib/template'

export const getFields = () => import('./fields/')

export { dataSchema } from './lib/dataSchema'
export type { ApplicationAnswers } from './lib/dataSchema'
export { Gender } from './utils/types'
export { PERIOD_ONE_MONTH, PERIOD_TWELVE_MONTHS } from './utils/constants'
export { messages } from './lib/messages'

export default template
