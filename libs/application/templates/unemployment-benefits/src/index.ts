import { UnemploymentBenefits } from './lib/dataSchema'
import template from './lib/UnemploymentBenefitsTemplate'
export const getFields = () => import('./fields/')
export * from './shared'
export type UnemploymentBenefitsAnswers = UnemploymentBenefits

export default template
