import template from './lib/TrainingLicenseOnAWorkMachineTemplate'
import { TrainingLicenseOnAWorkMachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields/')

export type TrainingLicenseOnAWorkMachine = TrainingLicenseOnAWorkMachineAnswers
export default template
