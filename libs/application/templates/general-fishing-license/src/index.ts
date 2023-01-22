import { GeneralFishingLicense } from './lib/dataSchema'
import GeneralFishingLicenseTemplate from './lib/GeneralFishingLicenseTemplate'

export { error } from './lib/messages'

export const getFields = () => import('./fields')
export type GeneralFishingLicenseAnswers = GeneralFishingLicense

export default GeneralFishingLicenseTemplate
