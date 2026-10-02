import { GeneralFishingLicense } from './lib/dataSchema'
import GeneralFishingLicenseTemplate from './lib/GeneralFishingLicenseTemplate'

export const getFields = () => import('./fields')

export * from './lib/messages'

export type GeneralFishingLicenseAnswers = GeneralFishingLicense

export default GeneralFishingLicenseTemplate
