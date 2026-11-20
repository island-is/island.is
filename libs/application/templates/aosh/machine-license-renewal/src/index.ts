import template from './lib/MachineLicenseRenewalTemplate'

export { getApplicationAnswers } from './utils/getApplicationAnswers'
export { getApplicationExternalData } from './utils/getApplicationExternalData'
export type { MachineLicenseRenewalAnswers } from './lib/dataSchema'
export { medicalCertificate, payment, prerequisites } from './lib/messages'
export {
  isLegalDomicile,
  isOtherAddress,
  wantsPlasticCard,
} from './utils/conditions'

export default template
