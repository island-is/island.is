import { UnemploymentBenefits } from './lib/dataSchema'
import template from './lib/UnemploymentBenefitsTemplate'
export * from './shared'
export { serviceErrors as errorMsgs } from './lib/messages'
export const getFields = () => import('./fields/')

export type UnemploymentBenefitsAnswers = UnemploymentBenefits

export default template
