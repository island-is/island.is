import template from './lib/DrivingLicenseBookUpdateInstructorTemplate'
import { DrivingLicenseBookUpdateInstructor } from './lib/dataSchema'

export const getFields = () => import('./fields')
export const getDataProviders = () => import('./dataProviders')

export type DrivingLicenseBookUpdateInstructorAnswers =
  DrivingLicenseBookUpdateInstructor

export default template
