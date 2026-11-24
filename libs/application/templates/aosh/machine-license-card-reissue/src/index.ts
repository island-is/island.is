import template from './lib/MachineLicenseCardReissueTemplate'
import { MachineLicenseCardReissueAnswers } from './lib/dataSchema'
export const getFields = () => import('./fields/')

export * from './lib/messages'
export { AddressDeliveryType } from './shared'
export type { CardDeliveryAnswers } from './lib/dataSchema'

export type MachineLicenseCardReissue = MachineLicenseCardReissueAnswers

export default template
