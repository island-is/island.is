import template from './lib/template'
import { dataSchema } from './lib/dataSchema'
import { m } from './lib/messages'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export default template
export { dataSchema, m as messages }
export { requirementsMessages } from './lib/messages'
export {
  structuralCandidates,
  hasUsablePhoto,
  buildTypeEligibility,
  fakeTypeEligibility,
  ELIGIBILITY_EXTERNAL_DATA_ID,
} from './utils/eligibility'
export type { TypeEligibility } from './utils/eligibility'
export type { DrivingLicenseApplicationFor } from './utils/constants'
export type { DrivingLicenseFakeData } from './utils/constants'
