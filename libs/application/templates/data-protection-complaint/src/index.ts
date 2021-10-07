import DataProtectionComplaintTemplate from './lib/DataProtectionComplaintTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default DataProtectionComplaintTemplate
export {
  OnBehalf,
  SubjectOfComplaint,
  subjectOfComplaintValueLabelMapper,
  onBehalfValueLabelMapper,
  YES,
  NO,
  yesNoValueLabelMapper,
} from './shared'
export { DataProtectionComplaint } from './lib/dataSchema'
