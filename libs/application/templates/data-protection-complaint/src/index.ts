import DataProtectionComplaintTemplate from './lib/DataProtectionComplaintTemplate'
import * as appMessages from './lib/messages'

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

export const messages = appMessages

export { DataProtectionComplaint } from './lib/dataSchema'
