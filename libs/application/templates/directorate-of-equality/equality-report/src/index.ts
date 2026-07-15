import template from './lib/template'

export const getFields = () => import('./fields')
export { dataSchema } from './lib/dataSchema'
export type { ApplicationAnswers } from './lib/dataSchema'
export { Gender } from './utils/constants'

export default template
