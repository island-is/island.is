import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { getApplicationExternalData, getCategoriesOptions, getOneInstanceOfCategory } from './incomePlanUtils'

const buildApplication = (data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = 'draft' } = data ?? {}

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.INCOME_PLAN,
    created: new Date(),
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}