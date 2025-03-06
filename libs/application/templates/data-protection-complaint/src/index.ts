import DataProtectionComplaintTemplate from './lib/DataProtectionComplaintTemplate'
import { DataProtectionComplaint } from './lib/dataSchema'
import * as appMessages from './lib/messages'
export const getFields = () => import('./fields/')

export {
  OnBehalf,
  SubjectOfComplaint,
  subjectOfComplaintValueLabelMapper,
  onBehalfValueLabelMapper,
  yesNoValueLabelMapper,
} from './shared'

export const messages = appMessages

export type DataProtectionComplaintAnswers = DataProtectionComplaint

export default DataProtectionComplaintTemplate
