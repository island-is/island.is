import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { States } from '../utils/constants'
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
    expect(newState).toBe(States.SUBMITTED)
  })

  it('should transition from submitted to approved on approve', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.SUBMITTED,
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.APPROVE,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.APPROVED)
  })

  it('should transition from submitted to rejected on reject', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication({
        state: States.SUBMITTED,
      }),
      NewPrimarySchoolTemplate,
    )

    const [hasChanged, newState] = helper.changeState({
      type: DefaultEvents.REJECT,
    })
    expect(hasChanged).toBe(true)
    expect(newState).toBe(States.REJECTED)
  })
})
