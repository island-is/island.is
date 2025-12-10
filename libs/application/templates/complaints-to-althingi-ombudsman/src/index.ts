import ComplaintsToAlthingiOmbudsmanTemplate from './lib/ComplaintsToAlthingiOmbudsmanTemplate'
import { ComplaintsToAlthingiOmbudsman } from './lib/dataSchema'

export {
  ComplainedForTypes,
  ComplaineeTypes,
  OmbudsmanComplaintTypeEnum,
  GenderAnswerOptions,
} from './shared'
export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields')

export type ComplaintsToAlthingiOmbudsmanAnswers = ComplaintsToAlthingiOmbudsman

export default ComplaintsToAlthingiOmbudsmanTemplate
