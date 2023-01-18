import { GeneralFishingLicense } from './lib/dataSchema'
import GeneralFishingLicenseTemplate from './lib/GeneralFishingLicenseTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields')

export type GeneralFishingLicenseAnswers = GeneralFishingLicense

export default GeneralFishingLicenseTemplate
