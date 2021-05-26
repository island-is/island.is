import FundingGovernmentProjectsTemplate from './lib/FundingGovernmentProjectsTemplate'
import { FundingGovernmentProjects as FundingGovernmentProjectsType } from './lib/dataSchema'
import * as appMessages from './lib/messages'

export const getFields = () => import('./fields/')

export default FundingGovernmentProjectsTemplate

export type FundingGovernmentProjectsAnswers = FundingGovernmentProjectsType

export const messages = appMessages
