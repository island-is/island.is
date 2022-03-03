import DataProtectionComplaintTemplate from './lib/DataProtectionComplaintTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default DataProtectionComplaintTemplate

export { DataProtectionComplaint } from './lib/dataSchema'
export {
  NO,
  OnBehalf,
  onBehalfValueLabelMapper,
  SubjectOfComplaint,
  subjectOfComplaintValueLabelMapper,
  YES,
  yesNoValueLabelMapper,
} from './shared'
