import { UnemploymentBenefits } from './lib/dataSchema'
import template from './lib/UnemploymentBenefitsTemplate'
export * from './shared'
export const getFields = () => import('./fields/')

export type UnemploymentBenefitsAnswers = UnemploymentBenefits

export default template
