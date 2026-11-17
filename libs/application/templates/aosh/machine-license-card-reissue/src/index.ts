import template from './lib/MachineLicenseCardReissueTemplate'
import { MachineLicenseCardReissueAnswers } from './lib/dataSchema'
export const getFields = () => import('./fields/')

export * from './lib/messages'

export type MachineLicenseCardReissue = MachineLicenseCardReissueAnswers

export default template
