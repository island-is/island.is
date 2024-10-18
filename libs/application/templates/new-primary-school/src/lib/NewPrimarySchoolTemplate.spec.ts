import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  ExternalData,
  DefaultEvents,
  FormValue,
  ApplicationStatus,
} from '@island.is/application/types'
import NewPrimarySchoolTemplate from './NewPrimarySchoolTemplate'

const buildApplication = (data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = 'draft' } = data
  return {
    id: '12345',
    assignees: [],
    applicant: '123456-7890',
    typeId: ApplicationTypes.NEW_PRIMARY_SCHOOL,
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
  }
}

describe('New Primary School Template', () => {
  it('should transition from draft to submitted on submit', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        answers: {
          confirmCorrectInfo: true,
        },
      }),
      NewPrimarySchoolTemplate,
    )
    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.SUBMIT,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe('submitted')
  })
})
